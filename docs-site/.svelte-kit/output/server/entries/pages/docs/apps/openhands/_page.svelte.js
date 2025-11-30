import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../../chunks/ssr.js";
import { b as base } from "../../../../../chunks/paths.js";
import { C as CodeBlock } from "../../../../../chunks/CodeBlock.js";
import { A as Alert, B as Badge } from "../../../../../chunks/Badge.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `${$$result.head += `<!-- HEAD_svelte-12bm0fl_START -->${$$result.title = `<title>OpenHands Integration | LLM Link</title>`, ""}<!-- HEAD_svelte-12bm0fl_END -->`, ""} <div class="prose prose-slate max-w-none"><h1 data-svelte-h="svelte-8l8q66">OpenHands Integration</h1> <p data-svelte-h="svelte-18ssn9">OpenHands is an AI agent framework for software development. LLM Link provides seamless integration with OpenHands through OpenAI-compatible APIs, allowing you to use any supported LLM provider.</p> ${validate_component(Alert, "Alert").$$render($$result, { type: "info" }, {}, {
    default: () => {
      return `<strong data-svelte-h="svelte-16t58o2">Docker Network:</strong> OpenHands runs in Docker, so use <code data-svelte-h="svelte-19rrjyb">host.docker.internal</code> as the hostname when configuring the API endpoint.`;
    }
  })} <h2 data-svelte-h="svelte-7tv6tr">Quick Start</h2> <h3 data-svelte-h="svelte-sqqr9q">Option 1: Using Startup Script (Recommended)</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./scripts/start-openhands.sh openai gpt-4 sk-your-key",
      language: "bash"
    },
    {},
    {}
  )} <h3 data-svelte-h="svelte-1pbs8sx">Option 2: Manual Configuration</h3> <ol><li><strong data-svelte-h="svelte-owa5qt">Start LLM Link:</strong> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app openhands --provider openai --model gpt-4 --api-key your-openai-key",
      language: "bash"
    },
    {},
    {}
  )}</li> <li data-svelte-h="svelte-5px8zf"><strong>Configure OpenHands in Web UI:</strong> <ul class="list-disc list-inside space-y-2 mt-2"><li>Click &quot;see advanced settings&quot;</li> <li>Enable the Advanced toggle at the top</li> <li>Set the following parameters:</li></ul></li></ol> <div class="bg-muted/50 rounded-lg p-4 my-4" data-svelte-h="svelte-15ls748"><h4 class="font-semibold mb-2">OpenHands Configuration:</h4> <ul class="space-y-1 text-sm font-mono"><li><strong>Custom Model:</strong> openai/gpt-4</li> <li><strong>Base URL:</strong> http://host.docker.internal:8091/v1</li> <li><strong>API Key:</strong> your-openai-key (or dummy for local models)</li></ul></div> <h2 data-svelte-h="svelte-g7d8dy">Supported Models</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6"><div class="border rounded-lg p-4"><h4 class="font-semibold mb-2" data-svelte-h="svelte-jfpxkb">🔥 Recommended</h4> <ul class="space-y-1 text-sm"><li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `OpenAI`;
    }
  })} GPT-4 - Strong reasoning</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Anthropic`;
    }
  })} Claude 3.5 Sonnet - Excellent coding</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Zhipu`;
    }
  })} GLM-4.6 - 200K context</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Aliyun`;
    }
  })} Qwen3 Coder Plus - Programming optimized</li></ul></div> <div class="border rounded-lg p-4"><h4 class="font-semibold mb-2" data-svelte-h="svelte-18kv7jp">Local Models</h4> <ul class="space-y-1 text-sm"><li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Ollama`;
    }
  })} Qwen2.5 Coder</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Ollama`;
    }
  })} DeepSeek Coder</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Ollama`;
    }
  })} Code Llama</li> <li>${validate_component(Badge, "Badge").$$render($$result, { variant: "outline" }, {}, {
    default: () => {
      return `Custom`;
    }
  })} Any OpenAI-compatible model</li></ul></div></div> <h2 data-svelte-h="svelte-1e64mgb">Configuration Examples</h2> <h3 data-svelte-h="svelte-1odzupn">Using Different Providers</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Anthropic Claude 3.5 Sonnet
./llm-link --app openhands --provider anthropic --model claude-3-5-sonnet-20241022 --api-key your-anthropic-key

# Zhipu GLM-4.6
./llm-link --app openhands --provider zhipu --model glm-4.6 --api-key your-zhipu-key

# Aliyun Qwen3 Coder Plus
./llm-link --app openhands --provider aliyun --model qwen3-coder-plus --api-key your-aliyun-key

# MiniMax M2
./llm-link --app openhands --provider minimax --model m2 --api-key your-minimax-key`,
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
./llm-link --app openhands --provider ollama --model qwen2.5-coder --api-key dummy

# Configure in OpenHands:
# Custom Model: openai/qwen2.5-coder
# Base URL: http://host.docker.internal:8091/v1
# API Key: dummy`,
      language: "bash"
    },
    {},
    {}
  )} <h2 data-svelte-h="svelte-104hhdi">Docker Network Configuration</h2> <p data-svelte-h="svelte-vxhnzr">Since OpenHands runs in Docker containers, you need to use the special hostname <code>host.docker.internal</code> to connect to services running on your host machine.</p> ${validate_component(Alert, "Alert").$$render($$result, { type: "warning" }, {}, {
    default: () => {
      return `<strong data-svelte-h="svelte-1wb4lxs">Important:</strong> Always use <code data-svelte-h="svelte-68w50e">host.docker.internal:PORT</code> instead of <code data-svelte-h="svelte-v6ez92">localhost:PORT</code> when configuring OpenHands.`;
    }
  })} <h3 data-svelte-h="svelte-1ovkk6x">Port Mapping</h3> <div class="bg-muted/50 rounded-lg p-4 my-4" data-svelte-h="svelte-rol7s7"><h4 class="font-semibold mb-2">Default Ports:</h4> <ul class="space-y-1 text-sm"><li><strong>LLM Link:</strong> 8091 (OpenHands default)</li> <li><strong>OpenHands Web UI:</strong> 3000</li> <li><strong>OpenHands API:</strong> 3001</li></ul></div> <h2 data-svelte-h="svelte-14oqoti">Advanced Configuration</h2> <h3 data-svelte-h="svelte-9bgpg0">Custom Port</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app openhands --provider openai --model gpt-4 --api-key your-key --port 8095",
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-1wrwg3a">Remember to update the Base URL in OpenHands configuration to match your custom port:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "http://host.docker.internal:8095/v1",
      language: "bash"
    },
    {},
    {}
  )} <h3 data-svelte-h="svelte-3zy45k">Authentication</h3> <p data-svelte-h="svelte-ag33kd">You can protect the LLM Link APIs with an authentication token:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app openhands --provider openai --model gpt-4 --api-key your-openai-key --auth-key your-secret-token",
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-1ufytx">Then use the auth token in OpenHands configuration:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "API Key: your-secret-token",
      language: "bash"
    },
    {},
    {}
  )} <h2 data-svelte-h="svelte-n7t7a8">Troubleshooting</h2> <div class="space-y-4"><div><h4 class="font-semibold" data-svelte-h="svelte-1mmazyx">OpenHands can&#39;t connect to LLM Link</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-178ut8o">Make sure you&#39;re using the correct hostname:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "# Correct: http://host.docker.internal:8091/v1\n# Wrong: http://localhost:8091/v1",
      language: "bash"
    },
    {},
    {}
  )}</div> <div><h4 class="font-semibold" data-svelte-h="svelte-ia3ph0">Connection refused</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-9ihjr4">Verify LLM Link is running on the correct port:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "curl http://localhost:8091/health",
      language: "bash"
    },
    {},
    {}
  )}</div> <div><h4 class="font-semibold" data-svelte-h="svelte-1vktrds">Model not found</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-ne6m6u">Check the model name and provider availability:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "./llm-link --app openhands --provider openai --model gpt-4 --api-key your-key --list-models",
      language: "bash"
    },
    {},
    {}
  )}</div> <div><h4 class="font-semibold" data-svelte-h="svelte-17x3q42">Docker network issues</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-rzhjso">Test the Docker network connectivity:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "docker run --rm alpine ping -c 1 host.docker.internal",
      language: "bash"
    },
    {},
    {}
  )}</div></div> <div class="pt-6 border-t text-sm text-muted-foreground"><a${add_attribute("href", `${basePath}/docs`, 0)} class="hover:underline">← Back to Docs index</a></div></div>`;
});
export {
  Page as default
};
