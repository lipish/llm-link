# Provider Trait 机制实施计划

## 📋 目标

引入 Provider Trait 机制，解决添加新 Provider 需要在多个文件中修改 match 语句的问题。

## 🎯 设计思路

### 当前问题

添加新 Provider（如 Minimax）需要在以下文件中修改：
1. `src/settings.rs` - 添加枚举变体
2. `src/llm/mod.rs` - 添加客户端创建逻辑
3. `src/service.rs` - 添加 model 提取逻辑
4. `src/llm/models.rs` - 添加 provider 名称映射（2处）
5. `src/api/mod.rs` - 添加 provider 名称映射（2处）
6. `src/api/config/mod.rs` - 添加配置处理（多处）
7. `src/api/openai.rs` - 添加 provider 识别
8. `src/api/ollama.rs` - 添加 provider 识别
9. `src/api/anthropic.rs` - 添加 provider 识别
10. `src/cli/loader.rs` - 添加环境变量和配置处理（多处）

**总计**：约 10 个文件，20+ 处修改

### 目标设计

```rust
// 定义 Provider Trait
trait Provider {
    fn name() -> &'static str;
    fn create_client(config: &ProviderConfig) -> Result<LlmClient>;
    fn default_model() -> &'static str;
    fn env_var_name() -> &'static str;
    fn api_type() -> ApiType;
}

// 注册表
static PROVIDERS: &[&dyn Provider] = &[
    &MinimaxProvider,
    &OpenAIProvider,
    // ...
];
```

**目标**：添加新 Provider 只需实现一个 Trait

## 📝 实施步骤

### 阶段 1: 定义 Trait 和基础结构

1. 创建 `src/provider/mod.rs`
2. 定义 `Provider` Trait
3. 定义 `ProviderConfig` 结构
4. 定义 `ApiType` 枚举

### 阶段 2: 实现现有 Provider

1. 为每个 Provider 创建实现模块
2. 实现 `Provider` Trait
3. 保持向后兼容

### 阶段 3: 重构现有代码

1. 重构 `llm/mod.rs` 使用注册表
2. 重构 `cli/loader.rs` 使用注册表
3. 更新配置处理逻辑

### 阶段 4: 测试和验证

1. 单元测试
2. 集成测试
3. 向后兼容性验证

## 🔧 技术细节

### Provider Trait 定义

```rust
pub trait Provider: Send + Sync {
    /// Provider 名称（如 "minimax", "openai"）
    fn name() -> &'static str;
    
    /// 创建 LLM 客户端
    fn create_client(config: &ProviderConfig) -> Result<LlmClient>;
    
    /// 默认模型名称
    fn default_model() -> &'static str;
    
    /// 环境变量名称
    fn env_var_name() -> &'static str;
    
    /// API 类型（OpenAI Compatible / Native）
    fn api_type() -> ApiType;
    
    /// 是否需要 base_url
    fn requires_base_url() -> bool;
    
    /// 默认 base_url（如果需要）
    fn default_base_url() -> Option<&'static str>;
}
```

### ProviderConfig 结构

```rust
pub struct ProviderConfig {
    pub api_key: String,
    pub model: String,
    pub base_url: Option<String>,
}
```

### ApiType 枚举

```rust
pub enum ApiType {
    OpenAICompatible,
    Native,
}
```

## 📊 实施进度

- [x] 阶段 1: Trait 定义
  - [x] 创建 `src/provider/mod.rs`
  - [x] 定义 `Provider` Trait
  - [x] 定义 `ProviderConfig` 结构
  - [x] 定义 `ApiType` 枚举
  - [x] 创建 `ProviderRegistry`
- [x] 阶段 2: Provider 实现
  - [x] MinimaxProvider
  - [x] OpenAIProvider
  - [x] AnthropicProvider
  - [x] OllamaProvider
  - [x] ZhipuProvider
  - [x] AliyunProvider
  - [x] VolcengineProvider
  - [x] TencentProvider
  - [x] LongcatProvider
  - [x] MoonshotProvider
- [ ] 阶段 3: 代码重构
  - [ ] 重构 `llm/mod.rs` 使用注册表
  - [ ] 重构 `cli/loader.rs` 使用注册表
  - [ ] 更新配置处理逻辑
- [ ] 阶段 4: 测试和验证
  - [ ] 单元测试
  - [ ] 集成测试
  - [ ] 向后兼容性验证

## 🚧 注意事项

1. **向后兼容**：确保现有代码继续工作
2. **渐进式迁移**：可以逐步迁移，不需要一次性完成
3. **测试覆盖**：确保所有 Provider 都能正常工作
4. **文档更新**：更新相关文档说明新机制

---

**开始时间**：2025-11-03  
**状态**：进行中

