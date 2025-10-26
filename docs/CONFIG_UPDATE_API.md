# llm-link 配置热更新 API 文档

## 概述

llm-link 提供了一套基于进程重启的配置热更新机制，适用于桌面应用（如 z-agent）集成。

**工作原理**:
1. z-agent 调用配置更新 API，获取新的启动参数和当前 `instance_id`
2. z-agent 停止当前 llm-link 进程
3. z-agent 使用新参数重启 llm-link
4. z-agent 轮询 `/api/health`，验证 `instance_id` 变化和配置正确

## API 端点

### 1. 获取健康状态（含实例 ID）

```bash
GET /api/health
```

**响应示例**:
```json
{
  "status": "ok",
  "instance_id": 1761455371,  // 启动时间戳，每次重启都会变化
  "pid": 12345,
  "provider": "ollama",
  "model": "llama2"
}
```

**用途**: 
- 验证服务是否就绪
- 通过 `instance_id` 确认重启成功
- 确认配置是否正确应用

### 2. 获取当前配置

```bash
GET /api/config/current
```

**响应示例**:
```json
{
  "provider": "ollama",
  "model": "llama2",
  "has_api_key": false,
  "has_base_url": true
}
```

### 2. 获取当前配置

```bash
GET /api/config/current
```

**响应示例**:
```json
{
  "provider": "ollama",
  "model": "llama2",
  "has_api_key": false,
  "has_base_url": true
}
```

### 3. 准备配置更新

```bash
POST /api/config/update
Content-Type: application/json

{
  "provider": "zhipu",
  "api_key": "your-api-key",
  "model": "glm-4-flash",     // 可选，有默认值
  "base_url": "custom-url"    // 可选
}
```

**响应示例**:
```json
{
  "status": "success",
  "message": "Config prepared for provider: zhipu",
  "restart_required": true,
  "current_instance_id": 1761455371,  // ⭐ 当前实例 ID，用于验证重启
  "env_vars": {
    "ZHIPU_API_KEY": "your-api-key"
  },
  "cli_args": {
    "provider": "zhipu",
    "model": "glm-4-flash"
  }
}
```

**重要**: `current_instance_id` 用于重启验证 - 重启后的 instance_id 应该不同。

### 4. 验证 API Key

```bash
POST /api/config/validate
Content-Type: application/json

{
  "provider": "zhipu",
  "api_key": "your-api-key",
  "base_url": "optional-url"
}
```

**响应示例**:
```json
{
  "status": "valid",
  "message": "API key is valid",
  "models": ["glm-4-flash", "glm-4", "glm-4-air"]
}
```

### 5. 获取进程 PID

```bash
GET /api/config/pid
```

**响应示例**:
```json
{
  "pid": 12345,
  "message": "Use this PID to restart the service"
}
```

### 6. 请求关闭

```bash
POST /api/config/shutdown
```

**响应示例**:
```json
{
  "status": "success",
  "message": "Shutdown signal sent. Please restart with new configuration."
}
```

## 完整重启验证流程

### 关键步骤

1. **获取旧 instance_id** - 从 `/api/config/update` 响应中获取
2. **重启进程** - 使用新的环境变量和参数
3. **等待新实例** - 轮询 `/api/health`，直到 `instance_id` 变化
4. **验证配置** - 确认 `provider` 和 `model` 正确

### 示例代码

详见 [RESTART_VERIFICATION.md](./RESTART_VERIFICATION.md) 获取完整的 TypeScript 和 Python 实现。

**简化版本**:
```typescript
async function updateAndRestart(provider: string, apiKey: string) {
  // 1. 准备更新
  const update = await fetch('/api/config/update', {
    method: 'POST',
    body: JSON.stringify({ provider, api_key: apiKey })
  }).then(r => r.json());
  
  const oldInstanceId = update.current_instance_id;
  
  // 2. 重启进程
  killProcess();
  startProcess(update.env_vars, update.cli_args);
  
  // 3. 等待新实例（最多 10 秒）
  for (let i = 0; i < 20; i++) {
    try {
      const health = await fetch('/api/health').then(r => r.json());
      if (health.instance_id !== oldInstanceId) {
        // 验证配置
        if (health.provider === provider) {
          console.log('✅ Restart successful');
          return health;
        }
      }
    } catch (e) {
      // 重启期间连接失败是正常的
    }
    await sleep(500);
  }
  
  throw new Error('Restart timeout');
}
```

## z-agent 集成示例

完整的 TypeScript 和 Python 实现请参考 [RESTART_VERIFICATION.md](./RESTART_VERIFICATION.md)。

以下是简化的集成示例：

### TypeScript/JavaScript

```typescript
class LlmLinkManager {
  private baseUrl = 'http://localhost:11434';
  private process: ChildProcess | null = null;

  // 更新配置并重启
  async updateConfig(provider: string, apiKey: string, model?: string) {
    // 1. 验证 API Key
    const validation = await this.validateKey(provider, apiKey);
    if (validation.status !== 'valid') {
      throw new Error(`Invalid API key: ${validation.message}`);
    }

    // 2. 准备配置
    const config = await fetch(`${this.baseUrl}/api/config/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, api_key: apiKey, model })
    }).then(r => r.json());

    // 3. 停止当前进程
    if (this.process) {
      this.process.kill();
      await this.waitForExit();
    }

    // 4. 使用新配置启动
    const env = { ...process.env, ...config.env_vars };
    const args = [
      '--app', 'zed',
      '--provider', config.cli_args.provider,
      '--model', config.cli_args.model
    ];

    this.process = spawn('llm-link', args, { env });
    
    // 5. 等待服务就绪
    await this.waitForReady();
  }

  // 验证 API Key
  async validateKey(provider: string, apiKey: string) {
    return await fetch(`${this.baseUrl}/api/config/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, api_key: apiKey })
    }).then(r => r.json());
  }

  // 获取当前配置
  async getCurrentConfig() {
    return await fetch(`${this.baseUrl}/api/config/current`)
      .then(r => r.json());
  }

  // 等待服务就绪
  private async waitForReady(maxRetries = 10) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${this.baseUrl}/health`);
        if (response.ok) return;
      } catch (e) {
        // 继续等待
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error('Service failed to start');
  }

  private async waitForExit() {
    return new Promise(resolve => {
      if (this.process) {
        this.process.on('exit', resolve);
      } else {
        resolve(null);
      }
    });
  }
}
```

### Python

```python
import requests
import subprocess
import time
import os

class LlmLinkManager:
    def __init__(self, base_url='http://localhost:11434'):
        self.base_url = base_url
        self.process = None

    def update_config(self, provider, api_key, model=None):
        """更新配置并重启服务"""
        # 1. 验证 API Key
        validation = self.validate_key(provider, api_key)
        if validation['status'] != 'valid':
            raise ValueError(f"Invalid API key: {validation['message']}")

        # 2. 准备配置
        config = requests.post(
            f"{self.base_url}/api/config/update",
            json={'provider': provider, 'api_key': api_key, 'model': model}
        ).json()

        # 3. 停止当前进程
        if self.process:
            self.process.terminate()
            self.process.wait()

        # 4. 使用新配置启动
        env = os.environ.copy()
        env.update(config['env_vars'])
        
        args = [
            'llm-link',
            '--app', 'zed',
            '--provider', config['cli_args']['provider'],
            '--model', config['cli_args']['model']
        ]

        self.process = subprocess.Popen(args, env=env)
        
        # 5. 等待服务就绪
        self.wait_for_ready()

    def validate_key(self, provider, api_key):
        """验证 API Key"""
        return requests.post(
            f"{self.base_url}/api/config/validate",
            json={'provider': provider, 'api_key': api_key}
        ).json()

    def get_current_config(self):
        """获取当前配置"""
        return requests.get(f"{self.base_url}/api/config/current").json()

    def wait_for_ready(self, max_retries=10):
        """等待服务就绪"""
        for _ in range(max_retries):
            try:
                response = requests.get(f"{self.base_url}/health")
                if response.ok:
                    return
            except:
                pass
            time.sleep(0.5)
        raise TimeoutError('Service failed to start')
```

## 支持的 Provider

| Provider | API Key 环境变量 | 默认 Model |
|----------|-----------------|------------|
| openai | OPENAI_API_KEY | gpt-4o |
| anthropic | ANTHROPIC_API_KEY | claude-3-5-sonnet-20241022 |
| zhipu | ZHIPU_API_KEY | glm-4-flash |
| ollama | (无需) | llama2 |
| aliyun | ALIYUN_API_KEY | qwen-turbo |
| volcengine | VOLCENGINE_API_KEY | ep-20241023xxxxx-xxxxx |
| tencent | TENCENT_API_KEY | hunyuan-lite |

## 注意事项

1. **重启时间**: 通常 < 1秒，用户几乎无感知
2. **并发请求**: 重启期间的请求会失败，z-agent 应显示"配置更新中..."
3. **API Key 安全**: API Key 不会被日志记录或返回给客户端
4. **验证建议**: 更新前先调用 `/api/config/validate` 确保 API Key 有效
5. **错误处理**: 如果重启失败，z-agent 应回退到之前的配置

## 完整流程示例

```typescript
// 1. 用户在 z-agent UI 中修改配置
async function onConfigChange(provider: string, apiKey: string) {
  // 显示加载状态
  showLoading('验证 API Key...');
  
  try {
    // 2. 验证 API Key
    const validation = await manager.validateKey(provider, apiKey);
    if (validation.status !== 'valid') {
      showError(`API Key 无效: ${validation.message}`);
      return;
    }
    
    // 3. 显示可用模型，让用户选择
    showModelSelector(validation.models);
    
  } catch (error) {
    showError('验证失败，请检查网络连接');
  }
}

async function onConfirm(provider: string, apiKey: string, model: string) {
  showLoading('更新配置中...');
  
  try {
    // 4. 更新配置并重启
    await manager.updateConfig(provider, apiKey, model);
    
    // 5. 验证新配置
    const config = await manager.getCurrentConfig();
    showSuccess(`已切换到 ${config.provider} - ${config.model}`);
    
  } catch (error) {
    showError('配置更新失败，请重试');
  }
}
```
