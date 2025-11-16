<script>
	import Button from '$lib/components/ui/button.svelte';
	import { Github, Terminal, Code, Settings, Globe, Check, AlertCircle, BookOpen, Zap, ListOrdered } from 'lucide-svelte';
	import { base } from '$app/paths';
	
	const basePath = base;
	
	const apiExamples = {
		models: `# Get all available models
curl -X GET http://localhost:8088/api/models

# Get models for specific provider
curl -X GET http://localhost:8088/api/models?provider=openai

# Response example
{
  "providers": {
    "openai": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "description": "Most capable model",
        "context_length": 8192,
        "pricing": { "input": 0.03, "output": 0.06 }
      }
    ],
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "description": "Latest Claude model",
        "context_length": 200000,
        "pricing": { "input": 0.003, "output": 0.015 }
      }
    ]
  }
}`,
		
		supportedModels: `# Get all supported models (static list)
curl -X GET http://localhost:8088/api/supported-models

# Get supported models for specific provider
curl -X GET http://localhost:8088/api/supported-models?provider=openai

# Response example
{
  "supported_models": {
    "openai": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "display_name": "GPT-4",
        "description": "Most capable GPT-4 model",
        "context_length": 8192,
        "max_output_tokens": 4096,
        "input_price": 0.03,
        "output_price": 0.06,
        "capabilities": ["chat", "completion", "function_calling", "vision"],
        "status": "available"
      }
    ],
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "display_name": "claude-3-5-sonnet-20241022",
        "description": "Latest Claude model with improved capabilities",
        "context_length": 200000,
        "max_output_tokens": 8192,
        "input_price": 0.003,
        "output_price": 0.015,
        "capabilities": ["chat", "vision", "long_context"],
        "status": "available"
      }
    ]
  },
  "total_models": 45,
  "last_updated": "2025-01-15T10:00:00Z"
}`,
		
		providerList: `# Get list of all supported providers
curl -X GET http://localhost:8088/api/provider-list

# Response example
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "display_name": "OpenAI",
      "description": "Leading AI models including GPT-4, GPT-3.5, and more",
      "api_type": "native",
      "base_url": "https://api.openai.com/v1",
      "requires_api_key": true,
      "env_var": "OPENAI_API_KEY",
      "supported_features": ["streaming", "function_calling", "vision"],
      "models_count": 5,
      "status": "available"
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "display_name": "Anthropic",
      "description": "Advanced Claude models with strong reasoning capabilities",
      "api_type": "native",
      "base_url": "https://api.anthropic.com",
      "requires_api_key": true,
      "env_var": "ANTHROPIC_API_KEY",
      "supported_features": ["streaming", "long_context", "vision"],
      "models_count": 3,
      "status": "available"
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "display_name": "Ollama",
      "description": "Local and open-source models",
      "api_type": "native",
      "base_url": "http://localhost:11434",
      "requires_api_key": false,
      "env_var": null,
      "supported_features": ["streaming", "custom_models", "local_deployment"],
      "models_count": 8,
      "status": "available"
    }
  ],
  "total_providers": 10,
  "available_providers": 10
}`,
		
		currentConfig: `# Get current configuration
curl -X GET http://localhost:8088/api/config/current

# Response example
{
  "provider": "openai",
  "model": "gpt-4",
  "has_api_key": true,
  "has_base_url": false,
  "supports_hot_reload": true
}`,
		
		validateKey: `# Validate API key before applying
curl -X POST http://localhost:8088/api/config/validate-key \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Response example
{
  "status": "valid",
  "message": "API key is valid and ready for hot update",
  "provider": "openai",
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable GPT-4 model"
    }
  ],
  "supports_hot_reload": true
}`,
		
		updateKey: `# Update API key without restart (hot reload)
curl -X POST http://localhost:8088/api/config/update-key \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Response example
{
  "status": "success",
  "message": "API key updated for provider: openai",
  "provider": "openai",
  "restart_required": false
}`,
		
		switchProvider: `# Switch to different provider dynamically
curl -X POST http://localhost:8088/api/config/switch-provider \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "api_key": "sk-ant-new-key-here"
  }'

# Response example
{
  "status": "success",
  "message": "Provider switched to: anthropic",
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "restart_required": false
}`,
		
		processManagement: `# Get process PID
curl -X GET http://localhost:8088/api/config/pid

# Response example
{
  "pid": 12345,
  "message": "Use this PID to restart the service"
}

# Trigger graceful shutdown
curl -X POST http://localhost:8088/api/config/shutdown

# Response example
{
  "status": "success",
  "message": "Shutdown signal sent. Please restart with new configuration."
}`,
		
		serviceInfo: `# Get comprehensive service information
curl -X GET http://localhost:8088/api/info

# Response example
{
  "service": "llm-link",
  "version": "0.3.3",
  "current_provider": "openai",
  "current_model": "gpt-4",
  "supported_providers": [
    {
      "name": "openai",
      "models": [
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "description": "Most capable GPT-4 model"
        }
      ]
    }
  ],
  "api_endpoints": {
    "openai": {
      "path": "/v1",
      "enabled": true,
      "auth_required": true
    }
  }
}

# Get health status with instance info
curl -X GET http://localhost:8088/api/health

# Response example
{
  "status": "ok",
  "instance_id": 1729900050,
  "pid": 12345,
  "provider": "openai",
  "model": "gpt-4"
}`,
		
		providers: `# Get all provider status
curl -X GET http://localhost:8088/api/providers

# Response example
{
  "providers": {
    "openai": {
      "status": "active",
      "configured": true,
      "models_count": 5,
      "api_type": "native",
      "base_url": "https://api.openai.com/v1"
    },
    "anthropic": {
      "status": "active",
      "configured": true,
      "models_count": 3,
      "api_type": "native",
      "base_url": "https://api.anthropic.com"
    },
    "ollama": {
      "status": "active",
      "configured": true,
      "models_count": 8,
      "api_type": "native",
      "base_url": "http://localhost:11434"
    }
  }
}`,
		
		config: `# Update provider configuration
curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Update multiple providers
curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "providers": {
      "openai": {
        "api_key": "sk-new-key-here"
      },
      "anthropic": {
        "api_key": "sk-ant-new-key-here"
      }
    }
  }'

# Response example
{
  "success": true,
  "message": "Configuration updated successfully",
  "updated_providers": ["openai", "anthropic"]
}`,
		
		health: `# Check service health
curl -X GET http://localhost:8088/api/health

# Response example
{
  "status": "healthy",
  "version": "0.3.5",
  "uptime": "2h 30m 15s",
  "active_protocols": ["openai", "anthropic", "ollama"],
  "configured_providers": 10,
  "total_models": 45,
  "system": {
    "cpu_usage": "15%",
    "memory_usage": "120MB",
    "port": 8088
  }
}`,
		
		openai: `# OpenAI Compatible API - Chat Completions
curl -X POST http://localhost:8088/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "stream": false,
    "temperature": 0.7
  }'

# Streaming response
curl -X POST http://localhost:8088/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Write a short story"
      }
    ],
    "stream": true,
    "temperature": 0.7
  }'`,
		
		anthropic: `# Anthropic Native API - Messages
curl -X POST http://localhost:8088/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Hello, Claude!"
      }
    ]
  }'

# Streaming response
curl -X POST http://localhost:8088/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 1024,
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing"
      }
    ]
  }'`,
		
		ollama: `# Ollama Compatible API - Generate
curl -X POST http://localhost:8088/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "prompt": "Why is the sky blue?",
    "stream": false
  }'

# Streaming response
curl -X POST http://localhost:8088/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "prompt": "Tell me a story",
    "stream": true
  }'

# Chat endpoint
curl -X POST http://localhost:8088/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": false
  }'`,
		
		error: `{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid API key provided",
    "code": "invalid_api_key"
  }
}`
	};

	const pageOutline = [
		{ id: 'overview', label: '概览' },
		{ id: 'management', label: '管理接口' },
		{ id: 'protocols', label: '协议代理' },
		{ id: 'diagnostics', label: '诊断与监控' },
		{ id: 'error-handling', label: '错误处理' },
		{ id: 'rate-limiting', label: '限流策略' }
	];

	const managementSections = [
		{
			title: '模型与 Provider 发现',
			description: '查询实时可用的模型、Provider 以及静态支持列表。',
			items: [
				{
					title: 'Models API',
					description: '动态返回已注册 Provider 的实时模型。',
					endpoints: ['GET /api/models', 'GET /api/models?provider=openai'],
					exampleKey: 'models'
				},
				{
					title: 'Supported Models API',
					description: '输出包含上下文长度、能力标签的静态模型列表。',
					endpoints: ['GET /api/supported-models', 'GET /api/supported-models?provider=openai'],
					exampleKey: 'supportedModels'
				},
				{
					title: 'Provider List API',
					description: '查询所有支持的 Provider 及其能力。',
					endpoints: ['GET /api/provider-list'],
					exampleKey: 'providerList'
				},
				{
					title: 'Providers API',
					description: '查看当前实例中每个 Provider 的状态。',
					endpoints: ['GET /api/providers'],
					exampleKey: 'providers'
				}
			]
		},
		{
			title: '运行时配置与热更新',
			description: '无需重启即可校验、更新、切换 Provider 配置。',
			items: [
				{
					title: 'Current Config',
					description: '查看当前 Provider、模型与密钥状态。',
					endpoints: ['GET /api/config/current'],
					exampleKey: 'currentConfig'
				},
				{
					title: 'Validate API Key',
					description: '预先校验 Provider API Key，避免热更新失败。',
					endpoints: ['POST /api/config/validate-key'],
					exampleKey: 'validateKey'
				},
				{
					title: 'Update API Key (Hot Reload)',
					description: '在运行中替换单个 Provider 的密钥。',
					endpoints: ['POST /api/config/update-key'],
					exampleKey: 'updateKey'
				},
				{
					title: 'Switch Provider',
					description: '一次请求中切换 Provider + 模型。',
					endpoints: ['POST /api/config/switch-provider'],
					exampleKey: 'switchProvider'
				},
				{
					title: 'Bulk Config Update',
					description: '批量提交多个 Provider 的配置或密钥。',
					endpoints: ['POST /api/config/update'],
					exampleKey: 'config'
				}
			]
		},
		{
			title: '运维辅助',
			description: '管理进程、触发优雅关闭，并获取运行实例信息。',
			items: [
				{
					title: 'Process Management',
					description: '查询 PID 或请求优雅关停，便于外部编排。',
					endpoints: ['GET /api/config/pid', 'POST /api/config/shutdown'],
					exampleKey: 'processManagement'
				}
			]
		}
	];

	const protocolApis = [
		{
			title: 'OpenAI 兼容 API',
			description: '对接 OpenAI、Zhipu、Moonshot、Minimax、Longcat 等兼容客户端。',
			endpoints: ['POST /v1/chat/completions', 'GET /v1/models'],
			exampleKey: 'openai'
		},
		{
			title: 'Anthropic 原生 API',
			description: '完整支持 Claude Messages 协议与流式输出。',
			endpoints: ['POST /v1/messages', 'GET /v1/models'],
			exampleKey: 'anthropic'
		},
		{
			title: 'Ollama 兼容 API',
			description: '为本地模型和 Zed 这类客户端桥接 generate/chat/tags 接口。',
			endpoints: ['POST /api/generate', 'POST /api/chat', 'GET /api/tags'],
			exampleKey: 'ollama'
		}
	];

	const diagnosticApis = [
		{
			title: 'Service Info',
			description: '获取版本号、当前 Provider、启用协议等信息。',
			endpoints: ['GET /api/info'],
			exampleKey: 'serviceInfo'
		},
		{
			title: 'Health API',
			description: '检查实例健康度、端口、协议启用状态。',
			endpoints: ['GET /api/health'],
			exampleKey: 'health'
		}
	];

	const managementItemCount = managementSections.reduce((count, section) => count + section.items.length, 0);

	const summaryCards = [
		{ title: 'Base URL', value: 'http://localhost:8088', hint: '默认端口 8088，可通过 --port 修改' },
		{ title: '管理接口', value: `${managementItemCount}`, hint: '覆盖配置、发现、运维' },
		{ title: '协议代理', value: `${protocolApis.length}`, hint: 'OpenAI / Anthropic / Ollama' }
	];
</script>

<div class="container py-8">
	<div class="max-w-6xl mx-auto">
		<div class="mb-8">
			<h1 class="text-4xl font-bold tracking-tight mb-4">API Reference</h1>
			<p class="text-lg text-muted-foreground">
				Complete API documentation for LLM Link. Learn how to interact with all available endpoints,
				manage providers, and integrate with your applications.
			</p>
		</div>

		<section class="mb-10" aria-label="Table of contents">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-4">
					<ListOrdered class="h-5 w-5 mr-2 text-primary" />
					<h2 class="text-xl font-semibold">Page Outline</h2>
				</div>
				<div class="grid gap-3 md:grid-cols-3">
					{#each pageOutline as item}
						<a href={`#${item.id}`} class="text-sm text-muted-foreground hover:text-foreground">
							#{item.label}
						</a>
					{/each}
				</div>
			</div>
		</section>

		<section class="mb-12" id="overview">
			<div class="rounded-lg border bg-card p-6 space-y-8">
				<div class="flex items-center mb-2">
					<BookOpen class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">API Overview</h2>
				</div>
				<div class="grid gap-4 md:grid-cols-3">
					{#each summaryCards as card}
						<div class="rounded-lg border bg-muted/50 p-4">
							<p class="text-xs text-muted-foreground uppercase">{card.title}</p>
							<p class="text-2xl font-bold">{card.value}</p>
							<p class="text-xs text-muted-foreground">{card.hint}</p>
						</div>
					{/each}
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<h3 class="text-lg font-medium mb-3">Base URL</h3>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">http://localhost:8088</code>
						</div>
						<p class="text-sm text-muted-foreground mt-2">
							Default port is 8088, configurable via <code>--port</code> flag.
						</p>
					</div>
					<div>
						<h3 class="text-lg font-medium mb-3">Authentication</h3>
						<div class="space-y-2">
							<div class="bg-muted rounded-md p-3">
								<code class="text-xs font-mono">OpenAI API · Authorization: Bearer</code>
							</div>
							<div class="bg-muted rounded-md p-3">
								<code class="text-xs font-mono">Anthropic API · x-api-key + anthropic-version</code>
							</div>
							<div class="bg-muted rounded-md p-3">
								<code class="text-xs font-mono">Management APIs · 默认无需鉴权</code>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Management APIs Section -->
		<section class="mb-12" id="management">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Settings class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Management APIs</h2>
				</div>

				<div class="space-y-6">
					{#each managementSections as section}
						<div class="rounded-lg border bg-muted/30 p-5">
							<div class="flex flex-col gap-2 mb-4">
								<div class="flex items-center justify-between">
									<h3 class="text-xl font-semibold">{section.title}</h3>
									<span class="text-xs text-muted-foreground">{section.items.length} 个端点组</span>
								</div>
								<p class="text-sm text-muted-foreground">{section.description}</p>
							</div>
							<div class="space-y-4">
								{#each section.items as item}
									<div class="rounded-lg border bg-card p-4">
										<div class="flex items-center justify-between mb-2">
											<h4 class="font-medium">{item.title}</h4>
											<span class="text-xs text-muted-foreground">{item.endpoints.length} endpoints</span>
										</div>
										<p class="text-sm text-muted-foreground mb-3">{item.description}</p>
										<div class="grid gap-2 md:grid-cols-2 mb-3">
											{#each item.endpoints as endpoint}
												<div class="bg-muted rounded p-3">
													<code class="text-xs font-mono">{endpoint}</code>
												</div>
											{/each}
										</div>
										{#if item.exampleKey}
											<div class="bg-muted rounded-md p-4">
												<code class="text-sm font-mono whitespace-pre-wrap">{apiExamples[item.exampleKey]}</code>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Protocol APIs Section -->
		<section class="mb-12" id="protocols">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Terminal class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Protocol APIs</h2>
				</div>
				<p class="text-sm text-muted-foreground mb-6">
					LLM Link 同时暴露 OpenAI、Anthropic、Ollama 三种协议入口，自动完成认证与格式转换。
				</p>
				<div class="grid gap-6">
					{#each protocolApis as protocol}
						<div class="rounded-lg border bg-muted/40 p-5">
							<h3 class="text-lg font-semibold mb-2">{protocol.title}</h3>
							<p class="text-sm text-muted-foreground mb-3">{protocol.description}</p>
							<div class="grid gap-2 md:grid-cols-3 mb-3">
								{#each protocol.endpoints as endpoint}
									<div class="bg-muted rounded p-3">
										<code class="text-xs font-mono">{endpoint}</code>
									</div>
								{/each}
							</div>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm font-mono whitespace-pre-wrap">{apiExamples[protocol.exampleKey]}</code>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Diagnostics Section -->
		<section class="mb-12" id="diagnostics">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Code class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Diagnostics & Monitoring</h2>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					{#each diagnosticApis as diag}
						<div class="rounded-lg border bg-muted/40 p-4">
							<h3 class="text-lg font-semibold mb-2">{diag.title}</h3>
							<p class="text-sm text-muted-foreground mb-3">{diag.description}</p>
							<div class="bg-muted rounded p-3 mb-3">
								<code class="text-xs font-mono">{diag.endpoints[0]}</code>
							</div>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm font-mono whitespace-pre-wrap">{apiExamples[diag.exampleKey]}</code>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Error Handling Section -->
		<section class="mb-12" id="error-handling">
			<div class="rounded-lg border bg-card p-6">
				<h2 class="text-2xl font-semibold mb-6">Error Handling</h2>
				
				<div class="space-y-4">
					<div class="border-l-4 border-red-400 pl-4">
						<h3 class="font-medium mb-2">HTTP Status Codes</h3>
						<div class="space-y-2">
							<div class="flex justify-between">
								<code class="text-xs font-mono">200</code>
								<span class="text-sm">Success</span>
							</div>
							<div class="flex justify-between">
								<code class="text-xs font-mono">400</code>
								<span class="text-sm">Bad Request</span>
							</div>
							<div class="flex justify-between">
								<code class="text-xs font-mono">401</code>
								<span class="text-sm">Unauthorized</span>
							</div>
							<div class="flex justify-between">
								<code class="text-xs font-mono">404</code>
								<span class="text-sm">Not Found</span>
							</div>
							<div class="flex justify-between">
								<code class="text-xs font-mono">500</code>
								<span class="text-sm">Internal Server Error</span>
							</div>
						</div>
					</div>
					
					<div class="border-l-4 border-yellow-400 pl-4">
						<h3 class="font-medium mb-2">Error Response Format</h3>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">{apiExamples.error}</code>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Rate Limiting Section -->
		<section class="mb-12" id="rate-limiting">
			<div class="rounded-lg border bg-card p-6">
				<h2 class="text-2xl font-semibold mb-6">Rate Limiting</h2>
				
				<div class="space-y-4">
					<p class="text-sm text-muted-foreground">
						LLM Link respects the rate limits of each provider. Limits are applied per provider 
						and are automatically managed based on the provider's specifications.
					</p>
					
					<div class="grid gap-4 md:grid-cols-2">
						<div class="border rounded-lg p-4">
							<h3 class="font-medium mb-2">OpenAI</h3>
							<p class="text-xs text-muted-foreground">
								3,500 requests per minute<br>
								90,000 tokens per minute
							</p>
						</div>
						<div class="border rounded-lg p-4">
							<h3 class="font-medium mb-2">Anthropic</h3>
							<p class="text-xs text-muted-foreground">
								1,000 requests per minute<br>
								40,000 tokens per minute
							</p>
						</div>
						<div class="border rounded-lg p-4">
							<h3 class="font-medium mb-2">Zhipu AI</h3>
							<p class="text-xs text-muted-foreground">
								600 requests per minute<br>
								120,000 tokens per minute
							</p>
						</div>
						<div class="border rounded-lg p-4">
							<h3 class="font-medium mb-2">Ollama</h3>
							<p class="text-xs text-muted-foreground">
								No rate limiting<br>
								Depends on local hardware
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<div class="mt-12 text-center">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				View on GitHub
			</Button>
			<Button variant="outline" size="lg" href="{basePath}/docs" class="ml-4">
				<BookOpen class="mr-2 h-4 w-4" />
				Back to Documentation
			</Button>
		</div>
	</div>
</div>
