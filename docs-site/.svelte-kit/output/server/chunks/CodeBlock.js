import { c as create_ssr_component, d as add_attribute } from "./ssr.js";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import rust from "highlight.js/lib/languages/rust";
import yaml from "highlight.js/lib/languages/yaml";
import json from "highlight.js/lib/languages/json";
/* empty css                                         */const css = {
  code: ".code-block-wrapper.svelte-1jzojsx.svelte-1jzojsx{position:relative;border-radius:0.5rem;overflow:hidden;background:#0d1117}.copy-button.svelte-1jzojsx.svelte-1jzojsx{position:absolute;top:0.5rem;right:0.5rem;background:rgba(255, 255, 255, 0.08);color:#e6edf3;border:1px solid rgba(255, 255, 255, 0.15);border-radius:0.375rem;font-size:0.75rem;padding:0.2rem 0.6rem;cursor:pointer;transition:background 0.2s ease;user-select:none}.copy-button.svelte-1jzojsx.svelte-1jzojsx:hover{background:rgba(255, 255, 255, 0.18)}.copy-button.svelte-1jzojsx.svelte-1jzojsx:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}.code-block.svelte-1jzojsx.svelte-1jzojsx{margin:0;padding:1rem;overflow-x:auto;font-size:0.875rem;line-height:1.5;background:#0d1117;color:#c9d1d9;user-select:text}.code-block.svelte-1jzojsx code.svelte-1jzojsx{font-family:'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;user-select:text}.cb-command{color:#7ee787}.cb-comment{color:#8b949e}.line-numbers.svelte-1jzojsx.svelte-1jzojsx{counter-reset:line}.line-numbers.svelte-1jzojsx code.svelte-1jzojsx{counter-increment:line}.line-numbers.svelte-1jzojsx code.svelte-1jzojsx::before{content:counter(line);display:inline-block;width:2rem;margin-right:1rem;text-align:right;color:#6e7681}",
  map: null
};
const CodeBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { code } = $$props;
  let { language = "bash" } = $$props;
  let { showLineNumbers = false } = $$props;
  let highlightedCode = "";
  let wrapperRef = null;
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("rust", rust);
  hljs.registerLanguage("yaml", yaml);
  hljs.registerLanguage("json", json);
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.language === void 0 && $$bindings.language && language !== void 0)
    $$bindings.language(language);
  if ($$props.showLineNumbers === void 0 && $$bindings.showLineNumbers && showLineNumbers !== void 0)
    $$bindings.showLineNumbers(showLineNumbers);
  $$result.css.add(css);
  return `<div class="code-block-wrapper svelte-1jzojsx"${add_attribute("this", wrapperRef, 0)}><button class="copy-button svelte-1jzojsx" type="button" aria-label="Copy code">${`<span data-svelte-h="svelte-sgmf23">Copy</span>`}</button> <pre class="${["code-block svelte-1jzojsx", showLineNumbers ? "line-numbers" : ""].join(" ").trim()}"><code class="svelte-1jzojsx"><!-- HTML_TAG_START -->${highlightedCode}<!-- HTML_TAG_END --></code></pre> </div>`;
});
export {
  CodeBlock as C
};
