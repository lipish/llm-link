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

### 7. Token 管理和配额控制

#### Token 计数和限制
```rust
pub struct TokenManager {
    redis_client: redis::Client,
    quota_store: Arc<dyn QuotaStore>,
}

impl TokenManager {
    pub async fn check_quota(&self, api_key: &str, tokens_needed: u32) -> Result<bool> {
        // 滑动窗口计数
        let window_key = format!("quota:{}:{}", api_key, self.get_time_window());
        let current_usage: u32 = self.redis_client
            .get(&window_key)
            .await
            .unwrap_or(0);
            
        let quota = self.get_user_quota(api_key).await?;
        Ok(current_usage + tokens_needed <= quota)
    }
    
    pub async fn consume_tokens(&self, api_key: &str, tokens_used: u32) -> Result<()> {
        let window_key = format!("quota:{}:{}", api_key, self.get_time_window());
        self.redis_client
            .incr(&window_key)
            .await?;
        self.redis_client
            .expire(&window_key, 3600)  // 1小时窗口
            .await?;
        Ok(())
    }
}

// 配额策略
#[derive(Debug, Clone)]
pub struct QuotaPolicy {
    pub daily_limit: u32,
    pub hourly_limit: u32,
    pub minute_limit: u32,
    pub per_request_limit: u32,
}
```

#### 中间件插件架构
```rust
// 借鉴 Higress 的插件模式
pub trait MiddlewarePlugin: Send + Sync {
    async fn before_request(&self, ctx: &mut RequestContext) -> Result<()>;
    async fn after_response(&self, ctx: &mut ResponseContext) -> Result<()>;
}

pub struct TokenQuotaPlugin {
    token_manager: Arc<TokenManager>,
}

impl MiddlewarePlugin for TokenQuotaPlugin {
    async fn before_request(&self, ctx: &mut RequestContext) -> Result<()> {
        let tokens_needed = self.estimate_tokens(&ctx.request)?;
        if !self.token_manager.check_quota(&ctx.api_key, tokens_needed).await? {
            return Err(Error::QuotaExceeded);
        }
        ctx.tokens_needed = tokens_needed;
        Ok(())
    }
    
    async fn after_response(&self, ctx: &mut ResponseContext) -> Result<()> {
        let tokens_used = self.count_response_tokens(&ctx.response)?;
        self.token_manager.consume_tokens(&ctx.api_key, tokens_used).await?;
        Ok(())
    }
}
```

#### Provider 级别限流和队列管理
```rust
pub struct ProviderRateLimiter {
    limits: HashMap<usize, ProviderLimits>,  // provider_id -> limits
    queues: HashMap<usize, RequestQueue>,     // provider_id -> queue
    metrics: Arc<ProviderMetrics>,
}

#[derive(Debug, Clone)]
pub struct ProviderLimits {
    pub requests_per_second: u32,
    pub concurrent_requests: u32,
    pub tokens_per_minute: u32,
    pub cost_per_hour: f64,        // 成本限制
}

impl ProviderRateLimiter {
    pub async fn acquire_permit(&self, provider_id: usize, request: &ChatRequest) -> Result<RequestPermit> {
        let limits = self.limits.get(&provider_id)
            .ok_or(Error::ProviderNotFound)?;
            
        // 检查并发限制
        if self.metrics.get_concurrent_requests(provider_id) >= limits.concurrent_requests {
            // 加入队列等待
            return self.queue_request(provider_id, request).await;
        }
        
        // 检查速率限制
        if !self.check_rate_limits(provider_id, request).await? {
            return Err(Error::ProviderRateLimited);
        }
        
        // 检查成本限制
        if !self.check_cost_limits(provider_id, request).await? {
            return Err(Error::ProviderCostExceeded);
        }
        
        Ok(RequestPermit::new(provider_id, request.estimated_tokens()))
    }
    
    async fn queue_request(&self, provider_id: usize, request: &ChatRequest) -> Result<RequestPermit> {
        let queue = self.queues.get(&provider_id)
            .ok_or(Error::ProviderNotFound)?;
            
        let permit = queue.enqueue(request.clone()).await?;
        Ok(permit)
    }
}
```

#### 动态服务发现机制
```rust
pub struct ProviderRegistry {
    providers: Arc<RwLock<HashMap<usize, ProviderInfo>>>,
    health_checker: Arc<HealthChecker>,
    discovery_config: DiscoveryConfig,
}

#[derive(Debug, Clone)]
pub struct ProviderInfo {
    pub id: usize,
    pub name: String,
    pub endpoint: String,
    pub capabilities: Vec<String>,      // 支持的模型列表
    pub metadata: ProviderMetadata,
    pub registered_at: DateTime<Utc>,
    pub last_heartbeat: DateTime<Utc>,
}

#[derive(Debug, Clone)]
pub struct ProviderMetadata {
    pub region: String,
    pub cost_per_token: f64,
    pub avg_latency_ms: f64,
    pub success_rate: f64,
    pub max_tokens: u32,
}

impl ProviderRegistry {
    pub async fn register_provider(&self, info: ProviderInfo) -> Result<()> {
        // 验证 provider 连通性
        self.validate_provider(&info).await?;
        
        let mut providers = self.providers.write().await;
        providers.insert(info.id, info);
        
        // 启动健康检查
        self.health_checker.start_monitoring(info.id).await?;
        
        Ok(())
    }
    
    pub async fn discover_providers(&self) -> Result<Vec<ProviderInfo>> {
        let providers = self.providers.read().await;
        let mut healthy_providers = Vec::new();
        
        for (_, info) in providers.iter() {
            if self.health_checker.is_healthy(info.id) {
                healthy_providers.push(info.clone());
            }
        }
        
        Ok(healthy_providers)
    }
    
    pub async fn deregister_provider(&self, provider_id: usize) -> Result<()> {
        let mut providers = self.providers.write().await;
        providers.remove(&provider_id);
        
        // 停止健康检查
        self.health_checker.stop_monitoring(provider_id).await?;
        
        Ok(())
    }
}
```

#### 成本追踪和优化
```rust
pub struct CostTracker {
    cost_store: Arc<dyn CostStore>,
    pricing_cache: HashMap<String, TokenPricing>,  // model -> pricing
}

#[derive(Debug, Clone)]
pub struct TokenPricing {
    pub input_tokens_per_million: f64,
    pub output_tokens_per_million: f64,
    pub currency: String,
}

#[derive(Debug)]
pub struct RequestCost {
    pub provider_id: usize,
    pub model: String,
    pub input_tokens: u32,
    pub output_tokens: u32,
    pub total_cost: f64,
    pub currency: String,
}

impl CostTracker {
    pub async fn calculate_request_cost(&self, request: &ChatRequest, response: &ChatResponse) -> Result<RequestCost> {
        let pricing = self.get_pricing(&request.model).await?;
        
        let input_cost = (request.input_tokens as f64 / 1_000_000.0) * pricing.input_tokens_per_million;
        let output_cost = (response.output_tokens as f64 / 1_000_000.0) * pricing.output_tokens_per_million;
        let total_cost = input_cost + output_cost;
        
        Ok(RequestCost {
            provider_id: request.provider_id,
            model: request.model.clone(),
            input_tokens: request.input_tokens,
            output_tokens: response.output_tokens,
            total_cost,
            currency: pricing.currency,
        })
    }
    
    pub async fn get_cheapest_provider(&self, request: &ChatRequest, available_providers: &[usize]) -> Result<usize> {
        let mut cheapest_provider = None;
        let mut min_cost = f64::INFINITY;
        
        for &provider_id in available_providers {
            let estimated_cost = self.estimate_cost(provider_id, request).await?;
            if estimated_cost < min_cost {
                min_cost = estimated_cost;
                cheapest_provider = Some(provider_id);
            }
        }
        
        cheapest_provider.ok_or(Error::NoAvailableProviders)
    }
}
```

#### 请求对冲机制（请求队列优化)
```rust
pub struct RequestHedging {
    hedge_threshold_ms: u64,        // 触发对冲的延迟阈值
    hedge_providers: Vec<usize>,    // 备用 provider 列表
    cost_threshold: f64,            // 成本阈值
}

impl RequestHedging {
    pub async fn execute_with_hedge<F, T>(&self, primary_operation: F, request: &ChatRequest) -> Result<T>
    where
        F: Fn() -> Pin<Box<dyn Future<Output = Result<T>>>> + Send + Sync,
    {
        let start_time = Instant::now();
        
        // 启动主请求
        let primary_future = primary_operation();
        
        // 设置超时触发对冲
        let hedge_delay = Duration::from_millis(self.hedge_threshold_ms);
        let hedge_future = async {
            tokio::time::sleep(hedge_delay).await;
            if self.should_hedge(request) {
                self.execute_hedge_request(request).await
            } else {
                Err(Error::HedgeNotTriggered)
            }
        };
        
        // 等待任一完成
        tokio::select! {
            result = primary_future => {
                self.record_primary_success(start_time.elapsed());
                result
            },
            result = hedge_future => {
                self.record_hedge_success(start_time.elapsed());
                result
            }
        }
    }
    
    fn should_hedge(&self, request: &ChatRequest) -> bool {
        // 检查成本阈值和请求优先级
        request.priority >= Priority::High && 
        request.estimated_cost() <= self.cost_threshold
    }
}
```

#### 负载均衡策略
```rust
pub enum LoadBalanceStrategy {
    RoundRobin,
    LeastConnections,
    WeightedRoundRobin { weights: HashMap<usize, f32> },
    TokenBased,  // 基于剩余配额选择
    CostOptimized,  // 成本优化
    PerformanceBased,  // 基于历史性能
}

pub struct LoadBalancer {
    strategy: LoadBalanceStrategy,
    providers: Arc<RwLock<Vec<ProviderInstance>>>,
    health_checker: Arc<HealthChecker>,
}

impl LoadBalancer {
    pub async fn select_provider(&self, request: &ChatRequest) -> Result<usize> {
        let providers = self.providers.read().await;
        let healthy_providers: Vec<_> = providers.iter()
            .enumerate()
            .filter(|(_, p)| self.health_checker.is_healthy(p.id))
            .collect();
            
        match &self.strategy {
            LoadBalanceStrategy::WeightedRoundRobin { weights } => {
                self.select_weighted_provider(&healthy_providers, weights)
            },
            LoadBalanceStrategy::TokenBased => {
                self.select_by_quota(&healthy_providers, &request.api_key).await
            },
            LoadBalanceStrategy::CostOptimized => {
                self.select_by_cost(&healthy_providers, &request).await
            },
            _ => self.select_round_robin(&healthy_providers),
        }
    }
    
    fn select_by_quota(&self, providers: &[(usize, &ProviderInstance)], api_key: &str) -> Result<usize> {
        // 选择配额最充足的 provider
        let best_provider = providers.iter()
            .max_by(|a, b| {
                let quota_a = self.get_remaining_quota(a.1.id, api_key);
                let quota_b = self.get_remaining_quota(b.1.id, api_key);
                quota_a.cmp(&quota_b)
            })
            .ok_or(Error::NoHealthyProviders)?;
            
        Ok(best_provider.0)
    }
}
```

#### 智能重试和故障转移
```rust
pub struct RetryPolicy {
    pub max_retries: usize,
    pub retry_conditions: Vec<RetryCondition>,
    pub backoff_strategy: BackoffStrategy,
    pub fallback_chain: Vec<usize>,  // Provider ID 顺序
}

#[derive(Debug)]
pub enum RetryCondition {
    NetworkError,
    RateLimitError,
    ServerError(u16),  // 5xx 错误
    TimeoutError,
    QuotaExceeded,
}

pub struct FailoverManager {
    retry_policy: RetryPolicy,
    circuit_breakers: HashMap<usize, CircuitBreaker>,
    provider_metrics: Arc<ProviderMetrics>,
}

impl FailoverManager {
    pub async fn execute_with_failover<F, T>(&self, operation: F) -> Result<T>
    where
        F: Fn(usize) -> Pin<Box<dyn Future<Output = Result<T>>>> + Send + Sync,
    {
        let mut last_error = None;
        
        // 主 Provider 尝试
        for attempt in 0..=self.retry_policy.max_retries {
            match self.try_primary_provider(&operation, attempt).await {
                Ok(result) => return Ok(result),
                Err(e) => {
                    last_error = Some(e);
                    if attempt < self.retry_policy.max_retries {
                        self.wait_backoff(attempt).await;
                    }
                }
            }
        }
        
        // 故障转移到备用 Provider
        for &provider_id in &self.retry_policy.fallback_chain {
            if self.is_provider_available(provider_id).await {
                match operation(provider_id).await {
                    Ok(result) => {
                        self.record_successful_failover(provider_id);
                        return Ok(result);
                    },
                    Err(e) => last_error = Some(e),
                }
            }
        }
        
        Err(last_error.unwrap_or(Error::AllProvidersFailed))
    }
}
```

### 10. 多租户和命名空间隔离

#### 租户隔离架构
```rust
pub struct TenantManager {
    tenant_store: Arc<dyn TenantStore>,
    namespace_isolator: Arc<NamespaceIsolator>,
}

#[derive(Debug, Clone)]
pub struct Tenant {
    pub id: String,
    pub name: String,
    pub namespace: String,
    pub quota_policy: QuotaPolicy,
    pub provider_pool: Vec<usize>,  // 租户专属 Provider 池
    pub created_at: DateTime<Utc>,
}

impl TenantManager {
    pub async fn create_tenant(&self, tenant: Tenant) -> Result<()> {
        // 创建命名空间隔离
        self.namespace_isolator.create_namespace(&tenant.namespace).await?;
        
        // 分配专属 Provider 池
        self.assign_provider_pool(&tenant.id, &tenant.provider_pool).await?;
        
        // 设置配额策略
        self.set_quota_policy(&tenant.id, &tenant.quota_policy).await?;
        
        self.tenant_store.store(tenant).await
    }
    
    pub async fn get_tenant_providers(&self, tenant_id: &str) -> Result<Vec<ProviderInfo>> {
        let tenant = self.tenant_store.get(tenant_id).await?;
        self.get_providers_in_pool(&tenant.provider_pool).await
    }
    
    pub async fn isolate_tenant_resources(&self, tenant_id: &str) -> Result<TenantIsolation> {
        let tenant = self.tenant_store.get(tenant_id).await?;
        Ok(TenantIsolation {
            namespace: tenant.namespace,
            provider_pool: tenant.provider_pool,
            quota_limits: tenant.quota_policy,
        })
    }
}

#[derive(Debug)]
pub struct NamespaceIsolator {
    redis_namespaces: HashMap<String, redis::Client>,
    database_schemas: HashMap<String, String>,
}
```

#### API 版本管理和兼容性
```rust
pub struct ApiVersionManager {
    version_registry: Arc<VersionRegistry>,
    compatibility_matrix: CompatibilityMatrix,
}

#[derive(Debug, Clone)]
pub struct ApiVersion {
    pub version: String,
    pub deprecated: bool,
    pub sunset_date: Option<DateTime<Utc>>,
    pub supported_features: Vec<String>,
    pub breaking_changes: Vec<String>,
}

impl ApiVersionManager {
    pub async fn route_request(&self, request: &ApiRequest) -> Result<VersionedRequest> {
        let version = self.extract_version(request)?;
        let target_version = self.resolve_target_version(&version)?;
        
        // 检查兼容性
        if !self.is_compatible(&version, &target_version)? {
            return Err(Error::IncompatibleApiVersion);
        }
        
        // 转换请求格式
        self.transform_request(request, &version, &target_version).await
    }
    
    pub async fn register_version(&self, version: ApiVersion) -> Result<()> {
        // 验证版本规范
        self.validate_version_spec(&version)?;
        
        // 更新兼容性矩阵
        self.update_compatibility_matrix(&version)?;
        
        self.version_registry.register(version).await
    }
}
```

#### 金丝雀部署策略
```rust
pub struct CanaryDeployment {
    deployment_config: CanaryConfig,
    traffic_splitter: Arc<TrafficSplitter>,
    metrics_collector: Arc<MetricsCollector>,
}

#[derive(Debug, Clone)]
pub struct CanaryConfig {
    pub rollout_percentage: f64,    // 金丝雀流量比例
    pub success_threshold: f64,     // 成功率阈值
    pub duration_minutes: u64,      // 观察期时长
    pub rollback_on_failure: bool,  // 失败时自动回滚
}

impl CanaryDeployment {
    pub async fn deploy_provider_config(&self, new_config: ProviderConfig) -> Result<()> {
        // 创建金丝钥部署
        let canary_id = self.create_canary_deployment(&new_config).await?;
        
        // 分配流量
        self.traffic_splitter.set_split_ratio(canary_id, self.deployment_config.rollout_percentage).await?;
        
        // 监控指标
        let metrics = self.monitor_canary_performance(canary_id, self.deployment_config.duration_minutes).await?;
        
        // 评估部署结果
        if metrics.success_rate >= self.deployment_config.success_threshold {
            self.promote_canary_to_production(canary_id).await?;
        } else if self.deployment_config.rollback_on_failure {
            self.rollback_canary_deployment(canary_id).await?;
        }
        
        Ok(())
    }
    
    async fn monitor_canary_performance(&self, canary_id: String, duration_minutes: u64) -> Result<CanaryMetrics> {
        let start_time = Instant::now();
        let mut metrics = CanaryMetrics::new();
        
        while start_time.elapsed() < Duration::from_minutes(duration_minutes) {
            let current_metrics = self.metrics_collector.get_canary_metrics(&canary_id).await?;
            metrics.aggregate(current_metrics);
            
            // 提前终止条件
            if metrics.error_rate > 0.1 || metrics.latency_p95 > Duration::from_secs(10) {
                warn!("金丝雀部署性能异常，提前终止");
                break;
            }
            
            tokio::time::sleep(Duration::from_secs(30)).await;
        }
        
        Ok(metrics)
    }
}
```

#### 请求审计和调试日志
```rust
pub struct AuditLogger {
    audit_store: Arc<dyn AuditStore>,
    encryption: Arc<ConfigEncryption>,
    retention_policy: RetentionPolicy,
}

#[derive(Debug, Clone)]
pub struct AuditRecord {
    pub request_id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub request_hash: String,        // 请求内容哈希
    pub request_summary: RequestSummary,
    pub response_summary: ResponseSummary,
    pub provider_id: usize,
    pub latency: Duration,
    pub token_usage: TokenUsage,
    pub cost: f64,
    pub timestamp: DateTime<Utc>,
    pub metadata: HashMap<String, String>,
}

#[derive(Debug, Clone)]
pub struct RequestSummary {
    pub method: String,
    pub path: String,
    pub model: String,
    pub input_tokens: u32,
    pub estimated_cost: f64,
}

impl AuditLogger {
    pub async fn log_request(&self, request: &ChatRequest, response: &ChatResponse, metadata: RequestMetadata) -> Result<()> {
        let audit_record = AuditRecord {
            request_id: metadata.request_id.clone(),
            tenant_id: metadata.tenant_id.clone(),
            user_id: metadata.user_id.clone(),
            request_hash: self.calculate_request_hash(request)?,
            request_summary: self.create_request_summary(request)?,
            response_summary: self.create_response_summary(response)?,
            provider_id: metadata.provider_id,
            latency: metadata.latency,
            token_usage: TokenUsage {
                input: request.input_tokens,
                output: response.output_tokens,
                total: request.input_tokens + response.output_tokens,
            },
            cost: metadata.actual_cost,
            timestamp: Utc::now(),
            metadata: metadata.extra,
        };
        
        // 加密敏感数据
        let encrypted_record = self.encrypt_sensitive_data(audit_record).await?;
        
        // 存储审计记录
        self.audit_store.store(encrypted_record).await?;
        
        // 应用保留策略
        self.apply_retention_policy().await?;
        
        Ok(())
    }
    
    pub async fn query_audit_logs(&self, query: AuditQuery) -> Result<Vec<AuditRecord>> {
        let records = self.audit_store.query(query).await?;
        
        // 解密敏感数据
        let decrypted_records = futures::future::try_join_all(
            records.into_iter().map(|r| self.decrypt_sensitive_data(r))
        ).await?;
        
        Ok(decrypted_records)
    }
    
    pub async fn replay_request(&self, request_id: &str) -> Result<ChatResponse> {
        let audit_record = self.audit_store.get_by_request_id(request_id).await?;
        let original_request = self.reconstruct_request(&audit_record)?;
        
        // 使用相同的 Provider 重新执行
        let provider = self.get_provider(audit_record.provider_id).await?;
        provider.chat(original_request).await
    }
}
```

#### 模块化架构
```rust
// observability/ 模块独立
pub mod metrics;
pub mod tracing;
pub mod logging;
pub mod health;

// 核心接口
pub trait ObservabilityProvider: Send + Sync {
    fn record_request(&self, metrics: RequestMetrics);
    fn record_error(&self, error: ErrorMetrics);
    fn update_health(&self, provider_id: usize, status: HealthStatus);
}

// 可插拔实现
pub struct PrometheusObservability {
    registry: prometheus::Registry,
    request_counter: prometheus::CounterVec,
    latency_histogram: prometheus::HistogramVec,
}

pub struct JaegerObservability {
    tracer: opentelemetry_jaeger::Tracer,
}

// 配置选择
#[derive(Debug, Clone)]
pub enum ObservabilityBackend {
    Prometheus { endpoint: String },
    Jaeger { endpoint: String },
    Custom { provider: Box<dyn ObservabilityProvider> },
    Disabled,
}
```

#### 主程序集成
```rust
// main.rs 中的集成
async fn create_observability(config: &ObservabilityConfig) -> Result<Box<dyn ObservabilityProvider>> {
    match config.backend {
        ObservabilityBackend::Prometheus { endpoint } => {
            Ok(Box::new(PrometheusObservability::new(endpoint)?))
        },
        ObservabilityBackend::Jaeger { endpoint } => {
            Ok(Box::new(JaegerObservability::new(endpoint)?))
        },
        ObservabilityBackend::Custom { provider } => Ok(provider),
        ObservabilityBackend::Disabled => Ok(Box::new(NoOpObservability)),
    }
}
```

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
