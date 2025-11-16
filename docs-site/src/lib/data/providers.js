export const providers = [
	{
		id: 'openai',
		name: 'OpenAI',
		description: 'Leading AI models including GPT-4, GPT-3.5, and more',
		models: ['GPT-4', 'GPT-4 Turbo', 'GPT-3.5 Turbo'],
		envVar: 'OPENAI_API_KEY',
		apiType: 'Native',
		baseUrl: 'https://api.openai.com/v1',
		features: ['Streaming', 'Function Calling', 'Vision'],
		website: 'https://openai.com'
	},
	{
		id: 'anthropic',
		name: 'Anthropic',
		description: 'Advanced Claude models with strong reasoning capabilities',
		models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
		envVar: 'ANTHROPIC_API_KEY',
		apiType: 'Native',
		baseUrl: 'https://api.anthropic.com',
		features: ['Streaming', 'Long Context', 'Vision'],
		website: 'https://anthropic.com'
	},
	{
		id: 'zhipu',
		name: 'Zhipu AI',
		description: 'Chinese AI models with multilingual support',
		models: ['GLM-4.6', 'GLM-4.5', 'GLM-4'],
		envVar: 'ZHIPU_API_KEY',
		apiType: 'OpenAI Compatible',
		baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
		features: ['Streaming', 'Multilingual', 'Code Generation'],
		website: 'https://zhipuai.cn'
	},
	{
		id: 'aliyun',
		name: 'Aliyun',
		description: "Alibaba Cloud's powerful Qwen models",
		models: ['Qwen3 Max', 'Qwen3 Plus', 'Qwen3 Turbo'],
		envVar: 'ALIYUN_API_KEY',
		apiType: 'Native',
		baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
		features: ['Streaming', 'Long Context', 'Multilingual'],
		website: 'https://aliyun.com'
	},
	{
		id: 'volcengine',
		name: 'Volcengine',
		description: "ByteDance's advanced Doubao models",
		models: ['Doubao Seed 1.6', 'Doubao Pro', 'Doubao Lite'],
		envVar: 'VOLCENGINE_API_KEY',
		apiType: 'Native',
		baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
		features: ['Streaming', 'Cost Effective', 'Fast Response'],
		website: 'https://volcengine.com'
	},
	{
		id: 'tencent',
		name: 'Tencent',
		description: "Tencent's Hunyuan models for various applications",
		models: ['Hunyuan T1', 'Hunyuan A13B', 'Hunyuan Turbos'],
		envVar: 'TENCENT_API_KEY',
		apiType: 'Native',
		baseUrl: 'https://hunyuan.tencentcloudapi.com',
		features: ['Streaming', 'Chinese Optimized', 'Enterprise Ready'],
		website: 'https://cloud.tencent.com'
	},
	{
		id: 'longcat',
		name: 'Longcat',
		description: 'High-performance models for general dialogue',
		models: ['LongCat Flash Chat', 'LongCat Flash Thinking'],
		envVar: 'LONGCAT_API_KEY',
		apiType: 'OpenAI Compatible',
		baseUrl: 'https://api.longcat.ai/v1',
		features: ['Streaming', 'Fast Response', 'Cost Effective'],
		website: 'https://longcat.ai'
	},
	{
		id: 'moonshot',
		name: 'Moonshot',
		description: 'Kimi models with large context windows',
		models: ['Kimi K2 Turbo', 'Kimi K2', 'Kimi K1.5'],
		envVar: 'MOONSHOT_API_KEY',
		apiType: 'OpenAI Compatible',
		baseUrl: 'https://api.moonshot.cn/v1',
		features: ['Streaming', '200K Context', 'Document Processing'],
		website: 'https://moonshot.cn'
	},
	{
		id: 'minimax',
		name: 'Minimax',
		description: 'Powerful AI models with OpenAI-compatible API',
		models: ['MiniMax-M2', 'MiniMax-H2', 'MiniMax-T2'],
		envVar: 'MINIMAX_API_KEY',
		apiType: 'OpenAI Compatible',
		baseUrl: 'https://api.minimaxi.com/v1',
		features: ['Streaming', 'Multilingual', 'Fast Response'],
		website: 'https://minimaxi.com'
	},
	{
		id: 'ollama',
		name: 'Ollama',
		description: 'Local and open-source models',
		models: ['Llama 2', 'Mistral', 'Code Llama', 'Custom Models'],
		envVar: 'None Required',
		apiType: 'Native',
		baseUrl: 'http://localhost:11434',
		features: ['Local Deployment', 'Privacy', 'Custom Models'],
		website: 'https://ollama.ai'
	}
];
