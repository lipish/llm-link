import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../../chunks/ssr.js";
import { b as base } from "../../../../../chunks/paths.js";
import { C as CodeBlock } from "../../../../../chunks/CodeBlock.js";
import { A as Alert, B as Badge } from "../../../../../chunks/Badge.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `${$$result.head += `<!-- HEAD_svelte-19v6zd8_START -->${$$result.title = `<title>Aider Integration | LLM Link</title>`, ""}<!-- HEAD_svelte-19v6zd8_END -->`, ""} <div class="prose prose-slate max-w-none"><h1 data-svelte-h="svelte-5f89kn">Aider Integration</h1> <p data-svelte-h="svelte-1nxxzk0">Aider is an AI pair programming tool that works in your terminal. LLM Link provides seamless integration with Aider using OpenAI-compatible APIs.</p> ${validate_component(Alert, "Alert").$$render($$result, { type: "info" }, {}, {
    default: () => {
      return `<strong data-svelte-h="svelte-10tisfr">Recommended Models:</strong> Use open-source models like GLM-4.6, Qwen3 Coder Plus, MiniMax M2, or Moonshot K2 for better performance and cost efficiency.`;
    }
  })} <h2 data-svelte-h="svelte-7tv6tr">Quick Start</h2> <h3 data-svelte-h="svelte-sqqr9q">Option 1: Using Startup Script (Recommended)</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./scripts/start-aider.sh",
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-1udcwt3">This will start Aider with the recommended Zhipu GLM-4.6 model by default.</p> <h3 data-svelte-h="svelte-1pbs8sx">Option 2: Manual Configuration</h3> <ol><li><strong data-svelte-h="svelte-owa5qt">Start LLM Link:</strong> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-zhipu-key",
      language: "bash"
    },
    {},
    {}
  )}</li> <li><strong data-svelte-h="svelte-dekd16">Set environment variables:</strong> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `export OPENAI_API_BASE=http://localhost:8090/v1
export OPENAI_API_KEY="your-auth-token"`,
      language: "bash"
    },
    {},
    {}
  )}</li> <li><strong data-svelte-h="svelte-186jpvm">Run Aider:</strong> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "aider --model openai/glm-4.6",
      language: "bash"
    },
    {},
    {}
  )}</li></ol> <h2 data-svelte-h="svelte-g7d8dy">Supported Models</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6"><div class="border rounded-lg p-4"><h4 class="font-semibold mb-2" data-svelte-h="svelte-jfpxkb">🔥 Recommended</h4> <ul class="space-y-1 text-sm"><li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Zhipu`;
    }
  })} GLM-4.6 - 200K context, strong coding</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Aliyun`;
    }
  })} Qwen3 Coder Plus - Programming optimized</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `MiniMax`;
    }
  })} M2 - High performance</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Moonshot`;
    }
  })} K2 - Open source model</li></ul></div> <div class="border rounded-lg p-4"><h4 class="font-semibold mb-2" data-svelte-h="svelte-1eo9z73">Available</h4> <ul class="space-y-1 text-sm"><li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `OpenAI`;
    }
  })} GPT-4, GPT-3.5</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Anthropic`;
    }
  })} Claude 3.5 Sonnet</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Volcengine`;
    }
  })} Doubao models</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Tencent`;
    }
  })} Hunyuan models</li></ul></div></div> <h2 data-svelte-h="svelte-1e64mgb">Configuration Examples</h2> <h3 data-svelte-h="svelte-1odzupn">Using Different Providers</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Aliyun Qwen3 Coder Plus
./llm-link --app aider --provider aliyun --model qwen3-coder-plus --api-key your-aliyun-key

# MiniMax M2
./llm-link --app aider --provider minimax --model m2 --api-key your-minimax-key

# Moonshot K2
./llm-link --app aider --provider moonshot --model k2 --api-key your-moonshot-key

# OpenAI GPT-4
./llm-link --app aider --provider openai --model gpt-4 --api-key your-openai-key`,
      language: "bash"
    },
    {},
    {}
  )} <h3 data-svelte-h="svelte-1esqgv9">Local Models with Ollama</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Pull a coding model
ollama pull qwen2.5-coder

# Start LLM Link with Ollama
./llm-link --app aider --provider ollama --model qwen2.5-coder --api-key dummy

# Use with Aider
export OPENAI_API_BASE=http://localhost:8090/v1
export OPENAI_API_KEY=dummy
aider --model openai/qwen2.5-coder`,
      language: "bash"
    },
    {},
    {}
  )} <h2 data-svelte-h="svelte-14oqoti">Advanced Configuration</h2> <h3 data-svelte-h="svelte-9bgpg0">Custom Port</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-key --port 8095",
      language: "bash"
    },
    {},
    {}
  )} <h3 data-svelte-h="svelte-3zy45k">Authentication</h3> <p data-svelte-h="svelte-ag33kd">You can protect the LLM Link APIs with an authentication token:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-zhipu-key --auth-key your-secret-token",
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-vl2my0">Then use the auth token when setting the API key:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "export OPENAI_API_KEY=your-secret-token",
      language: "bash"
    },
    {},
    {}
  )} <h2 data-svelte-h="svelte-n7t7a8">Troubleshooting</h2> <div class="space-y-4"><div><h4 class="font-semibold" data-svelte-h="svelte-ia3ph0">Connection refused</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-jx9ocy">Make sure LLM Link is running on port 8090:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "curl http://localhost:8090/health",
      language: "bash"
    },
    {},
    {}
  )}</div> <div><h4 class="font-semibold" data-svelte-h="svelte-1vktrds">Model not found</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-wfyw5n">Check that the model name is correct and available in the provider:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-key --list-models",
      language: "bash"
    },
    {},
    {}
  )}</div> <div><h4 class="font-semibold" data-svelte-h="svelte-1plczvm">Aider can&#39;t connect</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1kej921">Verify the environment variables are set correctly:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `echo $OPENAI_API_BASE  # Should be: http://localhost:8090/v1
echo $OPENAI_API_KEY   # Should be your auth token or dummy`,
      language: "bash"
    },
    {},
    {}
  )}</div></div> <div class="pt-6 border-t text-sm text-muted-foreground"><a${add_attribute("href", `${basePath}/docs`, 0)} class="hover:underline">← Back to Docs index</a></div></div>`;
});
export {
  Page as default
};
