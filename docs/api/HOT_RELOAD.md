# llm-link 热更新 API 文档

## 概述

llm-link 现在支持运行时热更新功能，允许在不重启服务的情况下动态更换 API Key 和切换 Provider。这对于桌面应用（如 z-agent）来说非常有用，用户可以通过设置界面随时修改配置。

## 新增的 API 接口

### 1. 查询当前配置

**GET** `/api/config/current`

查询当前使用的 provider、model 和配置状态。

**响应示例：**
```json
{
  "provider": "ollama",
  "model": "llama2",
  "has_api_key": false,
  "has_base_url": true,
  "supports_hot_reload": true
}
```

### 2. 运行时更新 API Key

**POST** `/api/config/update-key`

在不重启服务的情况下更新指定 provider 的 API Key。

**请求体：**
```json
{
  "provider": "openai",
  "api_key": "sk-...",
  "base_url": "https://api.openai.com/v1"  // 可选
}
```

**响应示例：**
```json
{
  "status": "success",
  "message": "API key updated for provider: openai",
  "provider": "openai",
  "restart_required": false
}
```

### 3. 切换 Provider

**POST** `/api/config/switch-provider`

动态切换当前使用的 LLM 服务商。

**请求体：**
```json
{
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",  // 可选
  "api_key": "sk-ant-...",                // 可选
  "base_url": "https://api.anthropic.com" // 可选
}
```

**响应示例：**
```json
{
  "status": "success",
  "message": "Provider switched to: anthropic",
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "restart_required": false
}
```

### 4. 验证 API Key（热更新版本）

**POST** `/api/config/validate-key`

在保存前测试 API Key 是否有效，并返回可用的模型列表。

**请求体：**
```json
{
  "provider": "openai",
  "api_key": "sk-...",
  "base_url": "https://api.openai.com/v1"  // 可选
}
```

**响应示例：**
```json
{
  "status": "valid",
  "message": "API key is valid and ready for hot update",
  "provider": "openai",
  "models": ["gpt-4o", "gpt-4", "gpt-3.5-turbo"],
  "supports_hot_reload": true
}
```

## 支持的 Provider

- `openai` - OpenAI API
- `anthropic` - Anthropic Claude API
- `zhipu` - 智谱 AI API
- `ollama` - Ollama 本地模型
- `aliyun` - 阿里云通义千问
- `volcengine` - 火山引擎
- `tencent` - 腾讯混元
- `longcat` - LongCat AI API

## 安全特性

1. **API Key 掩盖**：所有日志和响应中的 API Key 都会被安全掩盖
2. **输入验证**：对 provider 名称和 API Key 格式进行验证
3. **错误处理**：提供详细的错误信息和状态码

## 使用示例

### JavaScript/TypeScript 示例

```javascript
class LlmLinkClient {
  constructor(baseUrl = 'http://127.0.0.1:11434') {
    this.baseUrl = baseUrl;
  }

  async getCurrentConfig() {
    const response = await fetch(`${this.baseUrl}/api/config/current`);
    return await response.json();
  }

  async updateApiKey(provider, apiKey, baseUrl = null) {
    const payload = { provider, api_key: apiKey };
    if (baseUrl) payload.base_url = baseUrl;

    const response = await fetch(`${this.baseUrl}/api/config/update-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  }

  async switchProvider(provider, model = null, apiKey = null, baseUrl = null) {
    const payload = { provider };
    if (model) payload.model = model;
    if (apiKey) payload.api_key = apiKey;
    if (baseUrl) payload.base_url = baseUrl;

    const response = await fetch(`${this.baseUrl}/api/config/switch-provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  }

  async validateApiKey(provider, apiKey, baseUrl = null) {
    const payload = { provider, api_key: apiKey };
    if (baseUrl) payload.base_url = baseUrl;

    const response = await fetch(`${this.baseUrl}/api/config/validate-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  }
}

// 使用示例
const client = new LlmLinkClient();

// 查询当前配置
const config = await client.getCurrentConfig();
console.log('Current config:', config);

// 验证 API Key
const validation = await client.validateApiKey('openai', 'sk-...');
if (validation.status === 'valid') {
  // 更新 API Key
  const result = await client.updateApiKey('openai', 'sk-...');
  console.log('Update result:', result);
}

// 切换到不同的 provider
const switchResult = await client.switchProvider('anthropic', 'claude-3-5-sonnet-20241022', 'sk-ant-...');
console.log('Switch result:', switchResult);
```

### Python 示例

```python
import requests
import json

class LlmLinkClient:
    def __init__(self, base_url='http://127.0.0.1:11434'):
        self.base_url = base_url

    def get_current_config(self):
        response = requests.get(f'{self.base_url}/api/config/current')
        return response.json()

    def update_api_key(self, provider, api_key, base_url=None):
        payload = {'provider': provider, 'api_key': api_key}
        if base_url:
            payload['base_url'] = base_url
        
        response = requests.post(
            f'{self.base_url}/api/config/update-key',
            json=payload
        )
        return response.json()

    def switch_provider(self, provider, model=None, api_key=None, base_url=None):
        payload = {'provider': provider}
        if model:
            payload['model'] = model
        if api_key:
            payload['api_key'] = api_key
        if base_url:
            payload['base_url'] = base_url
        
        response = requests.post(
            f'{self.base_url}/api/config/switch-provider',
            json=payload
        )
        return response.json()

    def validate_api_key(self, provider, api_key, base_url=None):
        payload = {'provider': provider, 'api_key': api_key}
        if base_url:
            payload['base_url'] = base_url
        
        response = requests.post(
            f'{self.base_url}/api/config/validate-key',
            json=payload
        )
        return response.json()

# 使用示例
client = LlmLinkClient()

# 查询当前配置
config = client.get_current_config()
print('Current config:', config)

# 验证并更新 API Key
validation = client.validate_api_key('openai', 'sk-...')
if validation['status'] == 'valid':
    result = client.update_api_key('openai', 'sk-...')
    print('Update result:', result)
```

## 测试状态

✅ **已测试功能：**
- 查询当前配置
- 运行时更新 API Key
- 切换 Provider
- 验证 API Key
- API Key 安全掩盖
- 错误处理和验证

✅ **测试结果：**
- 所有热更新功能正常工作
- 服务无需重启即可切换配置
- API Key 在日志中被安全掩盖
- 返回详细的验证信息和模型列表

## 注意事项

1. **向后兼容**：现有的重启式配置更新方式仍然可用
2. **内存配置**：热更新的配置只存在于内存中，不会持久化到配置文件
3. **服务重启**：如果服务重启，配置会恢复到启动时的状态
4. **并发安全**：使用 RwLock 确保配置更新的线程安全

这个热更新功能为 z-agent 提供了更好的用户体验，用户可以在设置界面中随时更换 API Key 和切换 Provider，而无需重启 llm-link 服务。
