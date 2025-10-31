## z-agent 重启验证方案

### 核心机制

使用 `instance_id` 来跟踪服务重启：
- 每次 llm-link 启动时生成唯一的 `instance_id`（基于启动时间戳）
- z-agent 在重启前记录 `old_instance_id`
- 重启后轮询 `/api/health`，当 `instance_id` 变化时表示重启成功

### 完整流程

```typescript
class LlmLinkManager {
  private baseUrl = 'http://localhost:11434';
  private process: ChildProcess | null = null;

  async updateConfig(provider: string, apiKey: string, model?: string) {
    // 1. 准备配置并获取当前 instance_id
    const updateResponse = await fetch(`${this.baseUrl}/api/config/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, api_key: apiKey, model })
    }).then(r => r.json());

    const oldInstanceId = updateResponse.current_instance_id;
    const newConfig = updateResponse;

    // 2. 停止当前进程
    if (this.process) {
      this.process.kill();
      await this.waitForExit();
    }

    // 3. 使用新配置启动
    const env = { ...process.env, ...newConfig.env_vars };
    const args = [
      '--app', 'zed',
      '--provider', newConfig.cli_args.provider,
      '--model', newConfig.cli_args.model
    ];

    this.process = spawn('llm-link', args, { env });
    
    // 4. 等待新实例启动（验证 instance_id 变化）
    await this.waitForRestart(oldInstanceId);
    
    // 5. 验证配置是否正确应用
    const health = await this.getHealth();
    if (health.provider !== provider) {
      throw new Error('Config update failed: provider mismatch');
    }

    console.log(`✅ Restarted successfully: ${health.provider}/${health.model}`);
    return health;
  }

  // 等待新实例启动
  private async waitForRestart(
    oldInstanceId: number, 
    maxRetries = 20,
    retryDelay = 500
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const health = await fetch(`${this.baseUrl}/api/health`)
          .then(r => r.json());
        
        // instance_id 变化表示已重启
        if (health.instance_id !== oldInstanceId) {
          console.log(`✅ New instance detected: ${health.instance_id}`);
          return;
        }
        
        console.log(`⏳ Waiting for restart (${i + 1}/${maxRetries})...`);
      } catch (error) {
        // 进程重启期间会连接失败，这是正常的
        console.log(`⏳ Service restarting (${i + 1}/${maxRetries})...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    
    throw new Error('Restart timeout: service did not restart within expected time');
  }

  // 获取健康状态
  async getHealth() {
    return await fetch(`${this.baseUrl}/api/health`)
      .then(r => r.json());
  }

  private async waitForExit(): Promise<void> {
    return new Promise(resolve => {
      if (this.process) {
        this.process.on('exit', resolve);
        setTimeout(resolve, 5000); // 5秒超时
      } else {
        resolve();
      }
    });
  }
}
```

### Python 版本

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
        # 1. 准备配置并获取当前 instance_id
        response = requests.post(
            f"{self.base_url}/api/config/update",
            json={'provider': provider, 'api_key': api_key, 'model': model}
        ).json()

        old_instance_id = response['current_instance_id']
        new_config = response

        # 2. 停止当前进程
        if self.process:
            self.process.terminate()
            self.process.wait(timeout=5)

        # 3. 使用新配置启动
        env = os.environ.copy()
        env.update(new_config['env_vars'])
        
        args = [
            'llm-link',
            '--app', 'zed',
            '--provider', new_config['cli_args']['provider'],
            '--model', new_config['cli_args']['model']
        ]

        self.process = subprocess.Popen(args, env=env)
        
        # 4. 等待新实例启动
        self.wait_for_restart(old_instance_id)
        
        # 5. 验证配置
        health = self.get_health()
        if health['provider'] != provider:
            raise ValueError('Config update failed: provider mismatch')

        print(f"✅ Restarted successfully: {health['provider']}/{health['model']}")
        return health

    def wait_for_restart(self, old_instance_id, max_retries=20, retry_delay=0.5):
        """等待新实例启动"""
        for i in range(max_retries):
            try:
                health = requests.get(f"{self.base_url}/api/health").json()
                
                # instance_id 变化表示已重启
                if health['instance_id'] != old_instance_id:
                    print(f"✅ New instance detected: {health['instance_id']}")
                    return
                
                print(f"⏳ Waiting for restart ({i + 1}/{max_retries})...")
            except:
                # 进程重启期间会连接失败，这是正常的
                print(f"⏳ Service restarting ({i + 1}/{max_retries})...")
            
            time.sleep(retry_delay)
        
        raise TimeoutError('Restart timeout')

    def get_health(self):
        """获取健康状态"""
        return requests.get(f"{self.base_url}/api/health").json()
```

### API 响应示例

**更新前的配置准备**:
```bash
POST /api/config/update
```
```json
{
  "status": "success",
  "current_instance_id": 1729900000,
  "env_vars": {
    "ZHIPU_API_KEY": "sk-xxx"
  },
  "cli_args": {
    "provider": "zhipu",
    "model": "glm-4-flash"
  }
}
```

**重启后的健康检查**:
```bash
GET /api/health
```
```json
{
  "status": "ok",
  "instance_id": 1729900050,  // 已变化
  "pid": 12345,                // 新的 PID
  "provider": "zhipu",         // 新的 provider
  "model": "glm-4-flash"       // 新的 model
}
```

### 优势

1. ✅ **可靠验证**: 通过 instance_id 确保真的重启了
2. ✅ **配置确认**: 通过 health 响应确认新配置已生效
3. ✅ **快速反馈**: 通常 1-2 秒内完成重启
4. ✅ **错误处理**: 超时机制避免无限等待

### UI 状态提示

```typescript
// z-agent UI 状态管理
enum UpdateStatus {
  Idle = 'idle',
  Validating = 'validating',      // 验证 API Key
  Preparing = 'preparing',         // 准备配置
  Restarting = 'restarting',       // 重启中
  Verifying = 'verifying',         // 验证新配置
  Success = 'success',
  Failed = 'failed'
}

// UI 显示
const statusMessages = {
  validating: '验证 API Key...',
  preparing: '准备配置更新...',
  restarting: '重启服务中（约 1-2 秒）...',
  verifying: '验证新配置...',
  success: '✅ 配置更新成功',
  failed: '❌ 配置更新失败'
};
```

### 错误场景处理

1. **重启失败** - 超过 10 秒仍未检测到新 instance_id
   ```typescript
   catch (error) {
     // 尝试回退到旧配置
     await this.restorePreviousConfig();
   }
   ```

2. **配置不匹配** - instance_id 变了但 provider 不对
   ```typescript
   if (health.provider !== expectedProvider) {
     throw new Error('Config mismatch, rolling back...');
   }
   ```

3. **连接超时** - 重启时间过长
   ```typescript
   // 增加 maxRetries 或检查进程是否真的启动了
   if (!this.process || this.process.killed) {
     throw new Error('Process failed to start');
   }
   ```
