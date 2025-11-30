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

### 5. 错误处理和故障转移

#### Provider 故障处理策略
```rust
pub struct ProviderHealthManager {
    circuit_breakers: HashMap<usize, CircuitBreaker>,
    retry_policies: HashMap<String, RetryPolicy>,
    health_check_interval: Duration,
}

impl ProviderHealthManager {
    pub async fn handle_request_failure(&mut self, provider_id: usize, error: &Error) {
        // 更新熔断器状态
        let breaker = self.circuit_breakers.get_mut(&provider_id).unwrap();
        breaker.record_failure();
        
        // 如果熔断器打开，切换到备用 provider
        if breaker.is_open() {
            self.trigger_failover(provider_id).await;
        }
    }
    
    pub async fn trigger_failover(&mut self, failed_provider_id: usize) {
        // 根据配置的 fallback_chain 切换 provider
        let fallback_chain = self.get_fallback_chain(failed_provider_id);
        for provider_id in fallback_chain {
            if self.is_provider_healthy(provider_id).await {
                self.switch_primary_provider(provider_id).await;
                break;
            }
        }
    }
}

// 熔断器配置
pub struct CircuitBreakerConfig {
    failure_threshold: usize,      // 失败阈值：5次失败后打开
    recovery_timeout: Duration,     // 恢复超时：30秒后尝试半开
    success_threshold: usize,       // 成功阈值：3次成功后关闭
}
```

#### 重试机制
```rust
pub struct RetryPolicy {
    max_retries: usize,
    base_delay: Duration,
    max_delay: Duration,
    backoff_multiplier: f64,
}

impl RetryPolicy {
    pub async fn execute_with_retry<F, T, E>(&self, operation: F) -> Result<T, E>
    where
        F: Fn() -> Pin<Box<dyn Future<Output = Result<T, E>>>>,
        E: std::fmt::Debug,
    {
        let mut delay = self.base_delay;
        for attempt in 0..=self.max_retries {
            match operation().await {
                Ok(result) => return Ok(result),
                Err(e) if attempt < self.max_retries => {
                    tokio::time::sleep(delay).await;
                    delay = std::cmp::min(
                        Duration::from_millis((delay.as_millis() as f64 * self.backoff_multiplier) as u64),
                        self.max_delay
                    );
                },
                Err(e) => return Err(e),
            }
        }
        unreachable!()
    }
}
```

### 6. 数据库迁移工具

#### SQLx 迁移配置
```bash
# 项目结构
migrations/
├── 001_initial_schema.sql
├── 002_add_provider_encryption.sql
├── 003_add_fallback_chain.sql
└── 004_add_metrics_tables.sql
```

#### 迁移脚本示例
```sql
-- migrations/001_initial_schema.sql
CREATE TABLE providers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    config JSON NOT NULL,
    enabled BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app_mappings (
    id INTEGER PRIMARY KEY,
    app_name VARCHAR(50) NOT NULL,
    provider_id INTEGER,
    routing_rule VARCHAR(20) DEFAULT 'priority',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- migrations/002_add_provider_encryption.sql
-- 添加加密字段和迁移现有配置
ALTER TABLE providers ADD COLUMN config_encrypted TEXT;
UPDATE providers SET config_encrypted = config WHERE config IS NOT NULL;
ALTER TABLE providers DROP COLUMN config;
ALTER TABLE RENAME COLUMN config_encrypted TO config;
```

#### 自动迁移集成
```rust
// 在 main.rs 中集成自动迁移
#[tokio::main]
async fn main() -> Result<()> {
    // 运行数据库迁移
    sqlx::migrate!("./migrations").run(&pool).await?;
    
    // 其余初始化代码...
}
```

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
    routing_rule VARCHAR(20) DEFAULT 'priority',  -- priority, round_robin, least_connections, weighted
    fallback_chain JSON,  -- 失败时切换的 provider 顺序
    retry_config JSON DEFAULT '{"max_retries": 3, "backoff_ms": 1000}',
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

### 7. 认证授权和可观测性

#### 管理界面认证
```rust
// JWT 认证中间件
pub struct AuthMiddleware {
    jwt_secret: String,
}

impl AuthMiddleware {
    pub async fn authenticate_request(&self, token: &str) -> Result<User> {
        let claims = decode_jwt(token, &self.jwt_secret)?;
        Ok(User::from_claims(claims))
    }
}

// 权限控制
#[derive(Debug, Clone)]
pub enum Permission {
    ViewProviders,
    EditProviders,
    ViewMetrics,
    SystemConfig,
}

pub struct User {
    id: String,
    username: String,
    permissions: Vec<Permission>,
}
```

#### Provider 限流和连接池
```rust
pub struct ProviderConnectionPool {
    max_connections: usize,
    active_connections: Arc<AtomicUsize>,
    rate_limiter: RateLimiter,
}

impl ProviderConnectionPool {
    pub async fn acquire_connection(&self) -> Result<ConnectionHandle> {
        // 检查连接数限制
        if self.active_connections.load(Ordering::Relaxed) >= self.max_connections {
            return Err(Error::ConnectionPoolExhausted);
        }
        
        // 检查速率限制
        self.rate_limiter.acquire().await?;
        
        // 分配连接
        self.active_connections.fetch_add(1, Ordering::Relaxed);
        Ok(ConnectionHandle::new(self))
    }
}

// 速率限制器
pub struct RateLimiter {
    requests_per_second: u32,
    token_bucket: Arc<Mutex<TokenBucket>>,
}
```

#### OpenTelemetry 集成
```rust
use opentelemetry::{trace::Tracer, metrics::Meter};

pub struct ObservabilityConfig {
    tracer: Box<dyn Tracer + Send + Sync>,
    meter: Box<dyn Meter + Send + Sync>,
}

impl ObservabilityConfig {
    pub fn setup_telemetry() -> Self {
        // 设置 Jaeger/Prometheus 导出器
        let tracer = opentelemetry_jaeger::new_pipeline()
            .with_service_name("llm-link")
            .install_simple()
            .expect("Failed to install tracer");
            
        let meter = opentelemetry_prometheus::exporter()
            .with_registry(prometheus::default_registry())
            .build();
            
        Self { tracer, meter }
    }
    
    pub fn trace_request(&self, provider_id: usize, request: &ChatRequest) {
        let span = self.tracer.start(format!("provider_{}_request", provider_id));
        span.set_attribute("provider.id", provider_id);
        span.set_attribute("request.model", &request.model);
        // 更多追踪属性...
    }
}
```

#### 模型版本管理策略
```rust
pub struct ModelVersionManager {
    version_mappings: HashMap<String, Vec<ModelVersion>>,
    deprecation_schedule: HashMap<String, DeprecationInfo>,
}

#[derive(Debug, Clone)]
pub struct ModelVersion {
    name: String,
    provider_type: String,
    version: String,
    deprecated: bool,
    sunset_date: Option<DateTime<Utc>>,
    alternatives: Vec<String>,
}

impl ModelVersionManager {
    pub fn handle_model_request(&self, model: &str) -> Result<String> {
        let versions = self.version_mappings.get(model)
            .ok_or(Error::ModelNotFound)?;
            
        let active_version = versions.iter()
            .find(|v| !v.deprecated)
            .or_else(|| versions.first())  // 如果都废弃，使用最新版本
            .ok_or(Error::NoActiveModel)?;
            
        if active_version.deprecated {
            // 记录警告日志，建议迁移
            warn!("Model {} is deprecated, consider migrating to: {:?}", 
                  model, active_version.alternatives);
        }
        
        Ok(active_version.name.clone())
    }
}
```

### 8. 部署和运维考虑

#### Docker 容器化
```dockerfile
# Dockerfile
FROM rust:1.75-slim as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/llm-link /usr/local/bin/
EXPOSE 8080
CMD ["llm-link", "--config", "/etc/llm-link/config.yaml"]
```

#### Kubernetes 部署配置
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-link
spec:
  replicas: 3
  selector:
    matchLabels:
      app: llm-link
  template:
    metadata:
      labels:
        app: llm-link
    spec:
      containers:
      - name: llm-link
        image: llm-link:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: llm-link-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### 9. 备份恢复和服务等级协议

#### 数据库备份策略
```rust
pub struct BackupManager {
    db_path: PathBuf,
    backup_dir: PathBuf,
    retention_days: u32,
}

impl BackupManager {
    pub async fn create_backup(&self) -> Result<PathBuf> {
        let timestamp = Utc::now().format("%Y%m%d_%H%M%S");
        let backup_file = self.backup_dir.join(format!("backup_{}.db", timestamp));
        
        // 创建数据库快照
        let db = SqlitePoolOptions::new()
            .connect(&format!("sqlite:{}", self.db_path.display()))
            .await?;
            
        // 使用 SQLite VACUUM INTO 创建备份
        sqlx::query(&format!("VACUUM INTO '{}'", backup_file.display()))
            .execute(&db)
            .await?;
            
        // 压缩备份文件
        self.compress_backup(&backup_file).await?;
        
        // 清理过期备份
        self.cleanup_old_backups().await?;
        
        Ok(backup_file)
    }
    
    pub async fn restore_from_backup(&self, backup_file: &Path) -> Result<()> {
        // 验证备份文件完整性
        self.verify_backup_integrity(backup_file).await?;
        
        // 停止服务
        self.stop_service().await?;
        
        // 替换数据库文件
        tokio::fs::copy(backup_file, &self.db_path).await?;
        
        // 重启服务
        self.start_service().await?;
        
        Ok(())
    }
}
```

#### 服务等级协议 (SLA) 和目标 (SLO)
```yaml
# SLA 定义
service_level_agreements:
  availability:
    target: 99.9%  # 月度可用性
    measurement_window: 30d
    downtime_budget: 43.2m per month
    
  performance:
    latency_p50: <50ms
    latency_p95: <100ms
    latency_p99: <200ms
    throughput: 1000+ requests/second
    
  reliability:
    error_rate: <0.1%
    circuit_breaker_trips: <5 per day
    failover_time: <30s
    
  scalability:
    max_concurrent_providers: 20
    max_concurrent_requests: 5000
    memory_usage: <1GB per instance
```

#### 回滚程序
```bash
#!/bin/bash
# rollback.sh - 紧急回滚脚本

set -e

BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "开始回滚到备份: $BACKUP_FILE"

# 1. 停止服务
echo "停止 llm-link 服务..."
systemctl stop llm-link || docker-compose down

# 2. 备份当前状态（以防回滚失败）
echo "备份当前状态..."
cp /var/lib/llm-link/database.db /var/lib/llm-link/database.db.backup.$(date +%s)

# 3. 恢复数据库
echo "恢复数据库..."
cp "$BACKUP_FILE" /var/lib/llm-link/database.db

# 4. 验证数据库完整性
echo "验证数据库完整性..."
sqlite3 /var/lib/llm-link/database.db "PRAGMA integrity_check;"

# 5. 重启服务
echo "重启服务..."
systemctl start llm-link || docker-compose up -d

# 6. 健康检查
echo "执行健康检查..."
sleep 10
curl -f http://localhost:8080/health || {
    echo "健康检查失败，回滚可能不完整"
    exit 1
}

echo "回滚完成！"
```

#### 监控和告警配置
```yaml
# monitoring.yaml
alerts:
  high_error_rate:
    condition: error_rate > 0.1%
    duration: 5m
    severity: warning
    action: notify_team
    
  service_down:
    condition: availability < 99%
    duration: 1m
    severity: critical
    action: immediate_notification
    
  high_latency:
    condition: p95_latency > 100ms
    duration: 10m
    severity: warning
    action: scale_up_resources
    
  provider_failure:
    condition: provider_health_status != healthy
    duration: 30s
    severity: critical
    action: automatic_failover
```

## 管理界面设计

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
