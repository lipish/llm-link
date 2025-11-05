# LLM-Link 代码结构与 Provider 设置机制

## 📁 整体架构

```
llm-link
├── main.rs          # 程序入口，路由配置
├── settings.rs      # Provider 配置定义（枚举）
├── cli/             # 命令行参数解析和配置加载
├── llm/             # LLM 客户端封装（调用 llm-connector）
├── service.rs       # 服务层（业务逻辑）
├── api/             # HTTP API 端点
└── models/          # 模型配置（YAML）
```

## 🔄 Provider 设置流程

### 1. 命令行参数解析

**入口**: `main.rs` → `Args::parse()`

```rust
// 用户命令示例
./llm-link --app zed --provider minimax
```

**参数结构** (`cli/args.rs`):
- `--app`: 应用模式（zed, codex-cli 等）
- `--provider`: Provider 名称（minimax, openai 等）
- `--model`: 模型名称（可选）
- `--llm-api-key`: API Key（可选，优先于环境变量）

### 2. 配置加载流程

**文件**: `cli/loader.rs`

#### 步骤 1: 解析应用模式
```rust
// 确定应用配置（Zed, Codex CLI 等）
let app = SupportedApp::from_str(app_name)?;
let mut config = AppConfigGenerator::generate_config(&app, api_key);
```

#### 步骤 2: 应用 Provider 覆盖
```rust
// 根据 --provider 参数设置 LLM backend
config = Self::apply_provider_overrides(
    config,
    Some(provider),      // "minimax"
    args.model.as_deref(),  // 可选模型名称
    args.llm_api_key.as_deref()  // 可选的 API key
)?;
```

#### 步骤 3: Provider 设置逻辑 (`apply_provider_overrides`)

**a) 获取 API Key**
```rust
let api_key = match provider_name {
    "minimax" => std::env::var("MINIMAX_API_KEY").ok(),
    "openai" => std::env::var("OPENAI_API_KEY").ok(),
    // ... 其他 providers
    "ollama" => None,  // Ollama 不需要 API key
    _ => return Err("Unknown provider"),
};
```

**b) 确定默认模型**
```rust
let model_name = match provider_name {
    "minimax" => "MiniMax-M2".to_string(),
    "openai" => "gpt-4".to_string(),
    // ... 其他 providers
};
```

**c) 创建 Backend Settings**
```rust
config.llm_backend = match provider_name {
    "minimax" => LlmBackendSettings::Minimax {
        api_key: api_key_value,
        model: model_name,
    },
    // ... 其他 providers
};
```

### 3. Provider 类型定义

**文件**: `settings.rs`

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum LlmBackendSettings {
    OpenAI {
        api_key: String,
        base_url: Option<String>,
        model: String,
    },
    Anthropic {
        api_key: String,
        model: String,
    },
    Minimax {
        api_key: String,
        model: String,
    },
    // ... 其他 10 个 providers
}
```

**关键点**:
- 使用 Rust 枚举（enum）表示不同的 Provider
- 每个 Provider 有不同的字段结构
- 使用 `serde(tag = "type")` 支持 JSON 序列化

### 4. LLM 客户端创建

**文件**: `llm/mod.rs`

```rust
impl Client {
    pub fn new(config: &LlmBackendSettings) -> Result<Self> {
        let llm_client = match config {
            LlmBackendSettings::Minimax { api_key, .. } => {
                // Minimax 使用 OpenAI 兼容 API
                LlmClient::openai_compatible(
                    api_key, 
                    "https://api.minimaxi.com/v1", 
                    "minimax"
                )?
            },
            LlmBackendSettings::OpenAI { api_key, base_url, .. } => {
                if let Some(base_url) = base_url {
                    LlmClient::openai_compatible(api_key, base_url, "openai")?
                } else {
                    LlmClient::openai(api_key)?
                }
            },
            // ... 其他 providers
        };
        
        Ok(Self {
            backend: config.clone(),
            llm_client,  // 实际的 HTTP 客户端
            models_config: ModelsConfig::load_with_fallback(),
        })
    }
}
```

**关键点**:
- 根据 Provider 类型创建不同的 `LlmClient`
- 使用 `llm-connector` crate 处理实际的 HTTP 请求
- Minimax 使用 `openai_compatible` 模式（OpenAI 兼容 API）

### 5. 服务层初始化

**文件**: `service.rs`

```rust
pub struct Service {
    client: Client,      // LLM 客户端
    model: String,       // 默认模型名称
}

impl Service {
    pub fn new(config: &LlmBackendSettings) -> Result<Self> {
        let client = Client::new(config)?;
        let model = match config {
            LlmBackendSettings::Minimax { model, .. } => model.clone(),
            // ... 其他 providers
        };
        Ok(Self { client, model })
    }
}
```

### 6. 应用状态创建

**文件**: `main.rs`

```rust
// 初始化 LLM 服务
let llm_service = initialize_llm_service(&config)?;
let app_state = AppState::new(llm_service, config.clone());
```

**AppState** (`api/mod.rs`):
```rust
pub struct AppState {
    pub llm_service: Arc<RwLock<LlmService>>,  // 可线程安全访问
    pub config: Arc<RwLock<Settings>>,          // 配置可动态更新
}
```

## 🔀 运行时 Provider 切换

### 热重载机制

**API 端点**: `POST /api/config/switch-provider`

**文件**: `api/config/mod.rs`

```rust
pub async fn switch_provider(
    State(state): State<AppState>,
    Json(request): Json<SwitchProviderRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // 1. 验证 provider
    validate_provider(&request.provider)?;
    
    // 2. 构建新的 backend settings
    let new_backend = match request.provider.as_str() {
        "minimax" => LlmBackendSettings::Minimax {
            api_key,
            model,
        },
        // ... 其他 providers
    };
    
    // 3. 更新服务（无需重启）
    state.update_llm_service(&new_backend)?;
    
    Ok(Json(json!({
        "status": "success",
        "provider": request.provider,
        "restart_required": false,
    })))
}
```

**AppState::update_llm_service**:
```rust
pub fn update_llm_service(&self, new_backend: &LlmBackendSettings) -> Result<()> {
    // 创建新的 LLM 服务
    let new_service = LlmService::new(new_backend)?;
    
    // 更新服务（原子操作）
    {
        let mut service = self.llm_service.write()?;
        *service = new_service;
    }
    
    // 更新配置
    {
        let mut config = self.config.write()?;
        config.llm_backend = new_backend.clone();
    }
    
    Ok(())
}
```

## 📊 Provider 配置映射

### Provider 名称 → 环境变量

| Provider | 环境变量 | 默认模型 | API 类型 |
|----------|----------|----------|----------|
| minimax | `MINIMAX_API_KEY` | `MiniMax-M2` | OpenAI Compatible |
| openai | `OPENAI_API_KEY` | `gpt-4` | Native |
| anthropic | `ANTHROPIC_API_KEY` | `claude-3-5-sonnet-20241022` | Native |
| ollama | (无) | `llama2` | Native |
| zhipu | `ZHIPU_API_KEY` | `glm-4-flash` | OpenAI Compatible |
| moonshot | `MOONSHOT_API_KEY` | `kimi-k2-turbo-preview` | OpenAI Compatible |
| longcat | `LONGCAT_API_KEY` | `LongCat-Flash-Chat` | OpenAI Compatible |
| aliyun | `ALIYUN_API_KEY` | `qwen-max` | Native |
| volcengine | `VOLCENGINE_API_KEY` | `doubao-pro-32k` | Native |
| tencent | `TENCENT_API_KEY` | `hunyuan-lite` | Native |

## 🎯 添加新 Provider 的步骤

### 1. 在 `settings.rs` 添加枚举变体

```rust
pub enum LlmBackendSettings {
    // ... 现有 providers
    NewProvider {
        api_key: String,
        model: String,
    },
}
```

### 2. 在 `llm/mod.rs` 添加客户端创建逻辑

```rust
LlmBackendSettings::NewProvider { api_key, .. } => {
    LlmClient::new_provider(api_key)?
},
```

### 3. 在 `cli/loader.rs` 添加配置处理

```rust
// 环境变量映射
"newprovider" => std::env::var("NEW_PROVIDER_API_KEY").ok(),

// 默认模型
"newprovider" => "default-model".to_string(),

// Backend 设置创建
"newprovider" => LlmBackendSettings::NewProvider {
    api_key: api_key_value,
    model: model_name,
},
```

### 4. 在所有 match 语句中添加分支

需要更新的文件：
- `settings.rs` - `get_model()` 方法
- `service.rs` - `Service::new()`
- `llm/models.rs` - provider 名称映射
- `api/mod.rs` - provider 名称获取
- `api/config/mod.rs` - 所有配置相关函数
- `api/openai.rs`, `ollama.rs`, `anthropic.rs` - provider 识别

### 5. 在 `models.yaml` 添加模型配置

```yaml
newprovider:
  models:
    - id: "model-1"
      name: "Model 1"
      description: "Description"
```

## 🔍 关键设计模式

### 1. 枚举分发（Enum Dispatch）

使用 Rust 枚举进行类型分发：
```rust
match config {
    LlmBackendSettings::Minimax { .. } => { /* Minimax 逻辑 */ },
    LlmBackendSettings::OpenAI { .. } => { /* OpenAI 逻辑 */ },
    // ...
}
```

### 2. 线程安全的状态管理

使用 `Arc<RwLock<>>` 实现并发访问：
```rust
pub struct AppState {
    pub llm_service: Arc<RwLock<LlmService>>,
    pub config: Arc<RwLock<Settings>>,
}
```

### 3. 配置热重载

无需重启即可切换 Provider：
```rust
state.update_llm_service(&new_backend)?;
```

### 4. 统一接口抽象

所有 Provider 通过 `LlmClient` 统一接口：
```rust
pub async fn chat(&self, model: &str, messages: Vec<Message>) -> Result<Response>;
pub async fn chat_stream(&self, ...) -> Result<Stream>;
```

## 📝 总结

**Provider 设置的核心流程**:

1. **命令行解析** → 获取 `--provider` 参数
2. **配置加载** → 从环境变量读取 API Key，设置默认模型
3. **类型创建** → 创建 `LlmBackendSettings::Minimax { ... }`
4. **客户端初始化** → 根据 Provider 类型创建对应的 `LlmClient`
5. **服务创建** → 包装为 `Service` 层
6. **状态管理** → 存储在 `AppState` 中，支持热重载

这种设计使得添加新 Provider 只需要：
- 添加枚举变体
- 实现客户端创建逻辑
- 更新所有 match 语句
- 添加模型配置

所有 Provider 共享相同的接口和调用流程，确保了代码的一致性和可维护性。

