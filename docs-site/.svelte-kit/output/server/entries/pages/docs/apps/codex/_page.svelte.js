import { c as create_ssr_component, v as validate_component, e as escape, d as add_attribute } from "../../../../../chunks/ssr.js";
import "clsx";
import { C as CodeBlock } from "../../../../../chunks/CodeBlock.js";
import { b as base } from "../../../../../chunks/paths.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `<div class="max-w-3xl space-y-8"><div class="space-y-2" data-svelte-h="svelte-96debx"><p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Applications · Codex</p> <h1 class="text-3xl font-bold tracking-tight">Codex CLI Integration</h1> <p class="text-base text-muted-foreground">Use llm-link as an OpenAI-compatible backend for Codex CLI, so you can route different
			providers and models without changing Codex configuration.</p></div> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-qa4ct5">1. Start llm-link for Codex</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1oz24w6">Start the proxy pointing to Aliyun&#39;s <strong>Qwen3 Coder Plus</strong>. The <code>--app codex</code>
			preset opens an OpenAI-compatible endpoint at <code>http://localhost:8088/v1</code>.</p> <div class="space-y-2"><p data-svelte-h="svelte-17hox4b"><strong>Option 1: Use the startup script (Recommended)</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Set your API key as environment variable
export ALIYUN_API_KEY="your-aliyun-api-key"

# Run the startup script
./scripts/start-codex.sh`,
      language: "bash"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-q4hgyd">The script automatically handles macOS proxy issues and provides colored output.</p></div> <div class="space-y-2"><p data-svelte-h="svelte-1mi7ocn"><strong>Option 2: Manual startup</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Required for macOS to avoid proxy conflicts
export NO_PROXY='*'

# Start llm-link manually (recommended for tools)
llm-link --app codex --provider zhipu --api-key <YOUR_ZHIPU_KEY> --model glm-4.6 --auth-key your-token

# Alternative for text-only workflows
llm-link --app codex --provider aliyun --api-key <YOUR_ALIYUN_KEY> --model qwen3-coder-plus --auth-key your-token`,
      language: "bash"
    },
    {},
    {}
  )}</div> <p class="text-xs text-muted-foreground" data-svelte-h="svelte-5r3oin">You can also use <code>--provider zhipu --model glm-4.6</code> or others.</p> <div class="space-y-3 mt-4"><h3 class="text-lg font-medium" data-svelte-h="svelte-gvmwpc">Command Line Options</h3> <div class="space-y-2 text-sm"><p data-svelte-h="svelte-nwivb0"><strong>Basic Syntax:</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "llm-link --app codex [options]",
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-h9d4kk"><strong>Required Parameters:</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `--app codex          # Use Codex CLI preset configuration
--provider <provider> # LLM provider (aliyun, zhipu, openai, anthropic, etc.)
--api-key <key>       # Provider API key
--model <model>       # Model name`,
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-w7xilr"><strong>Optional Parameters:</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `--port 8088          # Custom port (default: 8088)
--host 0.0.0.0        # Bind address (default: 0.0.0.0)
--auth-key <token>    # Authentication token for client access
--log-level info      # Log level (debug, info, warn, error)
--config <file>       # Use configuration file instead of CLI args`,
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-1xrqalr"><strong>Example Commands:</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Start with Zhipu GLM-4.6
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6

# Start with custom port and auth
llm-link --app codex --provider aliyun --api-key <ALIYUN_KEY> --model qwen3-coder-plus --port 9999 --auth-key my-secret

# Start with debug logging
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6 --log-level debug

# Start without auth key (open access)
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6`,
      language: "bash"
    },
    {},
    {}
  )}</div></div></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-eksgn1">2. Configure Codex CLI</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1n7h2wy">Update your <code>~/.codex/config.toml</code> to define LLM Link as a provider and create profiles for Zhipu GLM-4.6 (recommended) and Aliyun (alternative):</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# 1. Define LLM Link as a model provider
[model_providers.llm_link]
name = "LLM Link (Zhipu GLM-4.6)"
base_url = "http://localhost:8088/v1"
env_key = "LLM_LINK_AUTH_TOKEN"

# 2. Define a profile using the Zhipu GLM-4.6 model (recommended for tools)
[profiles.zhipu_glm46]
model = "glm-4.6"
model_provider = "llm_link"

# 3. Alternative profile for Aliyun (text-only workflows)
[profiles.qwen3_coder]
model = "qwen3-coder-plus"
model_provider = "llm_link"`,
      language: "toml"
    },
    {},
    {}
  )} <div class="space-y-2 text-xs text-muted-foreground"><p class="font-semibold text-foreground text-sm" data-svelte-h="svelte-1mookk9">Authentication</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# llm-link without --auth-key (open access)
llm-link --app codex --provider zhipu --model glm-4.6 --api-key YOUR_ZHIPU_API_KEY

# llm-link with --auth-key (requires token)
llm-link --app codex --provider zhipu --model glm-4.6 --api-key YOUR_ZHIPU_API_KEY --auth-key my-secret

# Alternative for text-only workflows
llm-link --app codex --provider aliyun --model qwen3-coder-plus --api-key YOUR_ALIYUN_API_KEY --auth-key my-secret`,
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-1s6i7o4">Codex will send the auth token as <code>Authorization: Bearer ...</code> when calling llm-link. If you start
				llm-link without <code>--auth-key</code>, you can omit <code>env_key</code> from the codex.toml configuration
				entirely (Codex will still be able to reach the proxy).</p></div></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-1w9og2q">3. Start Using Codex CLI</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-6nmmzg">Once llm-link is running and Codex CLI is configured, you can start using Codex with your chosen LLM provider.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Verify Codex can connect to llm-link (recommended for tools)
codex --profile zhipu_glm46 "Hello, can you help me write a Python function?"

# Use Codex for coding assistance with tool support
codex --profile zhipu_glm46 "Write a function that sorts an array in JavaScript"

# Alternative for text-only workflows
codex --profile qwen3_coder "Explain how sorting algorithms work"

# Interactive mode (default, no flag needed)
codex --profile zhipu_glm46`,
      language: "bash"
    },
    {},
    {}
  )} <div class="space-y-2 text-xs text-muted-foreground"><p data-svelte-h="svelte-181hvlm"><strong>Available Commands:</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Use Zhipu GLM-4.6 profile (recommended for tools)
codex --profile zhipu_glm46 "your prompt"

# Use Aliyun profile (text-only workflows)
codex --profile qwen3_coder "your prompt"

# Interactive mode with Zhipu GLM-4.6
codex --profile zhipu_glm46

# Override model temporarily
codex --profile qwen3_coder --model "gpt-4" "your prompt"

# Get help
codex --help`,
      language: "bash"
    },
    {},
    {}
  )} <p data-svelte-h="svelte-mp72fa">Make sure llm-link is running in the background (http://localhost:8088) before using Codex CLI. 
				You&#39;ll see responses from your configured LLM provider (Zhipu, Aliyun, etc.) through the proxy.</p></div></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-4u2l56">4. Switching Providers</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1quega0">You can switch to other coding models (like GLM-4.6) by simply restarting llm-link.
			No changes to <code>~/.codex/config.toml</code> are strictly necessary if you reuse the profile name,
			or you can add a new profile:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Switch to Zhipu GLM-4.6
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6

# Switch to Volcengine Doubao
llm-link --app codex --provider volcengine --api-key <VOLC_KEY> --model doubao-seed-1.6`,
      language: "bash"
    },
    {},
    {}
  )}</section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-4kyzhx">5. Troubleshooting</h2> <div class="space-y-3"><h3 class="text-lg font-medium" data-svelte-h="svelte-1gibymw">502 Bad Gateway Errors</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-irkhij">If you encounter <code>502 Bad Gateway</code> errors when using Codex CLI, this is typically caused by proxy conflicts on macOS systems.</p> <div class="space-y-2" data-svelte-h="svelte-1kdzauw"><p><strong>Symptoms:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li>Codex CLI shows: <code>stream error: exceeded retry limit, last status: 502 Bad Gateway</code></li> <li>Direct curl requests to llm-link work fine</li> <li>llm-link logs show proxy usage: <code>proxy(http://127.0.0.1:7890) intercepts</code></li></ul></div> <div class="space-y-2"><p data-svelte-h="svelte-lx7lp6"><strong>Solution:</strong></p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Set NO_PROXY to disable automatic proxy detection
export NO_PROXY='*'

# Then restart llm-link
llm-link --app codex --provider aliyun --api-key <YOUR_KEY> --model qwen3-coder-plus --auth-key your-token

# Or use the startup script which handles this automatically
./scripts/start-codex.sh`,
      language: "bash"
    },
    {},
    {}
  )}</div></div> <div class="space-y-3"><h3 class="text-lg font-medium" data-svelte-h="svelte-ml0vas">Model Mismatch</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1adq729">Ensure the model in your <code>~/.codex/config.toml</code> matches the model llm-link is running with.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Check current llm-link model
curl -s http://localhost:8088/api/config/current

# Update your ~/.codex/config.toml if needed
[profiles.qwen3_coder]
model = "qwen3-coder-plus"  # Must match llm-link model
model_provider = "llm_link"`,
      language: "bash"
    },
    {},
    {}
  )}</div> <div class="space-y-3"><h3 class="text-lg font-medium" data-svelte-h="svelte-xf85td">Authentication Issues</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-3zzqe2">If you get <code>401 Unauthorized</code> errors, check that the authentication token matches between llm-link and Codex configuration.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Set the same token in both places
export LLM_LINK_AUTH_TOKEN="123456"

# Start llm-link with Zhipu provider (recommended for Codex with tools)
llm-link --app codex --provider zhipu --api-key <ZHIPU_API_KEY> --model glm-4.6 --auth-key 123456

# Or use Aliyun for text-only workflows
llm-link --app codex --provider aliyun --api-key <ALIYUN_API_KEY> --model qwen3-coder-plus --auth-key 123456

# Or use the convenience script (Aliyun)
./scripts/start-codex.sh

# Your ~/.codex/config.toml should have:
[model_providers.llm_link]
env_key = "LLM_LINK_AUTH_TOKEN"`,
      language: "bash"
    },
    {},
    {}
  )}</div> <div class="space-y-3"><h3 class="text-lg font-medium" data-svelte-h="svelte-1ca4rji">Tool Calls Not Working</h3> <p class="text-sm text-muted-foreground">If you notice Codex CLI showing tool calls as raw text (like <code>update_plan(${escape("{...}")})</code>) instead of executing them, this is due to API compatibility issues with certain providers.</p> <div class="space-y-2" data-svelte-h="svelte-10ne02v"><p><strong>Symptoms:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li>Tool calls appear as text instead of being executed</li> <li>Functions like <code>apply_patch</code>, <code>shell</code> show as raw text</li> <li>Model returns explanations instead of calling tools</li></ul></div> <div class="space-y-2" data-svelte-h="svelte-cz63u2"><p><strong>Affected Providers:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li><strong>Aliyun</strong>: qwen3-coder-plus returns text, qwen-max errors with tool_choice</li> <li><strong>Other providers</strong>: May have varying OpenAI tools API compatibility</li></ul></div> <div class="space-y-2"><p data-svelte-h="svelte-rktlrl"><strong>Recommended Solution:</strong></p> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-16ft2hl">For tool-heavy workflows, use providers with confirmed OpenAI tools API compatibility:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Confirmed working providers
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6
llm-link --app codex --provider openai --api-key <OPENAI_KEY> --model gpt-4
llm-link --app codex --provider anthropic --api-key <ANTHROPIC_KEY> --model claude-3-sonnet

# Note: Zhipu glm-4.6 has verified OpenAI tools API support
# Note: Aliyun has confirmed tools API incompatibility issues`,
      language: "bash"
    },
    {},
    {}
  )} <p class="text-sm text-muted-foreground" data-svelte-h="svelte-nxn961">For simple text generation without tools, Aliyun providers work well.</p></div></div> <div class="space-y-3" data-svelte-h="svelte-9aac4h"><h3 class="text-lg font-medium">Tool Calls Duplicating (Fixed)</h3> <p class="text-sm text-muted-foreground">Previous versions had streaming tool_calls duplication issues. This has been fixed in llm-connector 0.5.4+.</p> <div class="space-y-2"><p><strong>Fixed Issues:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li>Streaming tool_calls delta accumulation now works properly</li> <li>No more repeated tool execution in streaming mode</li> <li>Compatible with providers that support OpenAI tools format</li></ul></div></div></section> <div class="pt-6 border-t text-sm text-muted-foreground"><a${add_attribute("href", `${basePath}/docs`, 0)} class="hover:underline">← Back to Docs index</a></div></div>`;
});
export {
  Page as default
};
