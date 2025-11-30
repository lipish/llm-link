# LLM Link 多 Provider 扩展计划

## 概述

本文档描述了将 LLM Link 从单 Provider 架构扩展为多 Provider 管理系统的详细计划，包括基于 shadcn/ui 的管理界面设计。

## 当前架构基线分析

### 现有架构特点
- **单 Provider 配置**：启动时绑定一个 LLM provider（Zhipu、OpenAI、Anthropic 等）
- **并发支持**：使用 `Arc<RwLock<Service>>` 支持多客户端并发请求
- **动态切换**：支持运行时切换 provider，但切换期间所有请求使用新 provider
- **配置存储**：基于文件配置（YAML/JSON）
- **API 支持**：OpenAI、Ollama、Anthropic 兼容接口

### 架构限制
```rust
// 当前单 Provider 限制
pub struct AppState {
    pub llm_service: Arc<RwLock<LlmService>>,  // 单一服务实例
    pub config: Arc<RwLock<Settings>>,
}
```

### 性能基线
- 并发请求处理：基于 Tokio 异步运行时
- 内存占用：单进程 ~50MB
- 响应延迟：直接转发 + 10-20ms

## 扩展架构设计

### 1. 架构选择：进程池 vs 线程池

#### 方案对比
**进程池方案**：
- ✅ 更好的故障隔离
- ✅ 独立资源管理
- ❌ 更高的内存开销
- ❌ IPC 复杂性

**线程池方案（推荐）**：
- ✅ 利用 Rust 异步运行时优势
- ✅ 更低的内存开销
- ✅ 简化的状态管理
- ✅ 更容易实现请求流式传输

#### 推荐架构：单进程多 Provider
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Router        │    │  Provider Pool   │    │   Management    │
│   Service       │◄──►│  (Async Tasks)   │◄──►│   Interface     │
│   (单进程)       │    │                  │    │   (Web UI)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │  Provider 1      │    │   Database      │
│   Requests      │    │  Provider 2      │    │   (SQLite)      │
│                 │    │  Provider N      │    │   + Encryption  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### 进程间通信优化
- **HTTP API**：所有组件间使用 HTTP 通信，便于调试和监控
- **共享内存**：配置和状态使用 `Arc<RwLock<>>` 共享
- **消息通道**：异步任务间使用 `tokio::sync` 通道

### 3. 流式传输和实时通信

#### LLM 响应流式传输
```rust
// 流式响应处理
pub struct StreamingResponse {
    provider_id: usize,
    stream: UnboundedReceiverStream<String>,
    format: StreamFormat,  // SSE, WebSocket, or chunked HTTP
}

// 路由器支持流式转发
impl RouterService {
    pub async fn stream_chat(
        &self,
        request: ChatRequest,
        provider_id: usize,
    ) -> Result<StreamingResponse> {
        let provider = self.get_provider(provider_id).await?;
        provider.stream_chat(request).await
    }
}
```

#### 实时监控数据流
```typescript
// WebSocket 实时数据推送
interface RealtimeMetrics {
  providerId: string;
  requestCount: number;
  avgLatency: number;
  errorRate: number;
  timestamp: number;
}

// Server-Sent Events 用于流式日志
app.get('/api/logs/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  // 推送实时日志流
});
```

### 4. 安全和加密

#### API 密钥加密存储
```rust
use aes_gcm::{Aes256Gcm, Key, Nonce};
use base64::{Engine as _, engine::general_purpose};

pub struct ConfigEncryption {
    cipher: Aes256Gcm,
}

impl ConfigEncryption {
    pub fn encrypt_api_key(&self, api_key: &str) -> Result<String> {
        let key = Key::from_slice(&self.master_key);
        let cipher = Aes256Gcm::new(key);
        // 加密 API 密钥
        let encrypted = cipher.encrypt(nonce, api_key.as_bytes())?;
        Ok(general_purpose::STANDARD.encode(encrypted))
    }
    
    pub fn decrypt_api_key(&self, encrypted: &str) -> Result<String> {
        // 解密 API 密钥
        let encrypted_bytes = general_purpose::STANDARD.decode(encrypted)?;
        let decrypted = cipher.decrypt(nonce, encrypted_bytes.as_slice())?;
        Ok(String::from_utf8(decrypted)?)
    }
}
```

#### 热重载配置
```rust
// 支持配置热重载，无需重启
pub struct HotReloadConfig {
    config: Arc<RwLock<ProviderConfig>>,
    file_watcher: RecommendedWatcher,
}

impl HotReloadConfig {
    pub async fn watch_config_changes(&self) -> Result<()> {
        self.file_watcher.watch(Path::new("config.json"), RecursiveMode::Recursive)?;
        // 监听文件变化并自动重载配置
        Ok(())
    }
}
```

#### Provider 配置表
```sql
CREATE TABLE providers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,  -- openai, anthropic, zhipu, etc.
    config JSON NOT NULL,       -- provider-specific config (encrypted)
    enabled BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 应用映射表
```sql
CREATE TABLE app_mappings (
    id INTEGER PRIMARY KEY,
    app_name VARCHAR(50) NOT NULL,
    provider_id INTEGER,
    routing_rule VARCHAR(20) DEFAULT 'priority',  -- priority, load_balance, cost
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
```

#### 监控数据表
```sql
CREATE TABLE metrics (
    id INTEGER PRIMARY KEY,
    provider_id INTEGER,
    request_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    avg_latency FLOAT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
```

## 管理界面设计

### shadcn/ui Dashboard 组件

#### 1. 布局结构
```
src/routes/dashboard/
├── +layout.svelte          # 侧边栏布局
├── +page.svelte            # 概览仪表板
├── providers/
│   ├── +page.svelte        # Provider 列表
│   ├── [id]/+page.svelte   # Provider 详情
│   └── +new.svelte         # 添加 Provider
├── apps/
│   ├── +page.svelte        # 应用映射
│   └── [id]/+page.svelte   # 应用配置
├── monitoring/
│   ├── +page.svelte        # 实时监控
│   └── logs/+page.svelte   # 日志查看
└── settings/
    └── +page.svelte        # 系统设置
```

#### 2. 核心页面设计

**概览仪表板 (Dashboard Overview)**
```svelte
<!-- 使用 shadcn/ui 组件 -->
<Card>
  <CardHeader>
    <CardTitle>系统概览</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="活跃 Provider" value="5" />
      <StatCard title="今日请求" value="12,345" />
      <StatCard title="成功率" value="99.2%" />
      <StatCard title="平均延迟" value="125ms" />
    </div>
  </CardContent>
</Card>
```

**Provider 管理页面**
```svelte
<DataTable 
  data={providers}
  columns={[
    { key: 'name', label: '名称' },
    { key: 'type', label: '类型' },
    { key: 'status', label: '状态', component: StatusBadge },
    { key: 'actions', label: '操作', component: ActionButtons }
  ]}
/>
```

**实时监控页面**
- 使用 Chart.js 或 Recharts 显示请求量趋势
- WebSocket 实时数据更新
- Provider 健康状态指示器

#### 3. API 设计

**Provider 管理 API**
```typescript
// GET /api/providers
interface ProviderListResponse {
  providers: Provider[];
  total: number;
}

// POST /api/providers
interface CreateProviderRequest {
  name: string;
  type: 'openai' | 'anthropic' | 'zhipu' | 'ollama';
  config: ProviderConfig;
}

// PUT /api/providers/:id
interface UpdateProviderRequest extends CreateProviderRequest {
  enabled?: boolean;
  priority?: number;
}
```

**监控 API**
```typescript
// GET /api/monitoring/metrics
interface MetricsResponse {
  providers: ProviderMetrics[];
  system: SystemMetrics;
  timeframe: '1h' | '24h' | '7d' | '30d';
}

// WebSocket /api/monitoring/realtime
interface RealtimeUpdate {
  type: 'metrics' | 'status' | 'alert';
  data: any;
  timestamp: number;
}
```

## 实施阶段

### 阶段一：基础架构重构（2-3 周）

**目标**：建立多 Provider 基础架构

**任务清单**：
- [ ] 设计并实现 Provider Manager
- [ ] 创建进程池管理机制
- [ ] 实现数据库配置存储
- [ ] 开发基础管理 API
- [ ] 保持现有 CLI 兼容性

**技术要点**：
- 使用 `tokio::process` 管理 Provider 子进程
- SQLite 数据库集成（sqlx）
- RESTful API 设计（axum + serde）
- 配置迁移工具

### 阶段二：管理界面开发（3-4 周）

**目标**：完整的 Web 管理控制台

**任务清单**：
- [ ] 集成 shadcn/ui 组件库
- [ ] 实现响应式 Dashboard 布局
- [ ] 开发 Provider CRUD 界面
- [ ] 实现应用映射配置
- [ ] 添加实时监控功能

**技术要点**：
- SvelteKit + TypeScript
- Tailwind CSS + shadcn/ui
- Chart.js 数据可视化
- WebSocket 实时通信

### 阶段三：高级功能（2-3 周）

**目标**：企业级功能和优化

**任务清单**：
- [ ] 实现智能路由算法
- [ ] 添加故障转移机制
- [ ] 开发批量配置管理
- [ ] 集成告警系统
- [ ] 性能优化和测试

**技术要点**：
- 负载均衡算法实现
- 健康检查和熔断器
- 配置模板系统
- Prometheus 指标导出

## 兼容性和迁移策略

### 向后兼容性
- 保持现有 CLI 参数支持
- 配置文件自动迁移工具
- API 版本控制（v1/v2）

### 迁移路径
1. **渐进式迁移**：新功能并行开发，不影响现有功能
2. **配置升级**：提供自动转换工具
3. **部署策略**：支持蓝绿部署，零停机升级

## 性能目标

### 扩展性指标
- **Provider 数量**：支持 10+ 并发 Provider
- **并发请求**：1000+ 并发连接
- **响应延迟**：< 50ms 额外开销
- **内存占用**：< 200MB（含管理界面）

### 可靠性指标
- **可用性**：99.9% 系统可用性
- **故障恢复**：< 30s 自动故障切换
- **数据一致性**：强一致性配置更新

## 风险评估和缓解

### 技术风险
- **进程间通信复杂性**：使用成熟的 IPC 框架
- **状态同步问题**：采用事件驱动架构
- **性能回归**：建立基准测试和监控

### 实施风险
- **开发周期**：分阶段交付，降低风险
- **向后兼容**：充分的测试和迁移工具
- **用户体验**：保持现有 CLI 体验不变

## 总结

本扩展计划将 LLM Link 从单工具转换为企业级的多 Provider 管理平台，通过进程池架构和现代化的 Web 界面，提供强大的扩展能力和管理功能。实施过程中注重向后兼容性和渐进式升级，确保现有用户平滑过渡。
