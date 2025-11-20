import { c as create_ssr_component } from "./ssr.js";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import rust from "highlight.js/lib/languages/rust";
import yaml from "highlight.js/lib/languages/yaml";
import json from "highlight.js/lib/languages/json";
const githubDark = "";
const CodeBlock_svelte_svelte_type_style_lang = "";
const css = {
  code: ".code-block-wrapper.svelte-1pkdv5j.svelte-1pkdv5j{position:relative;border-radius:0.5rem;overflow:hidden;background:#0d1117}.code-block.svelte-1pkdv5j.svelte-1pkdv5j{margin:0;padding:1rem;overflow-x:auto;font-size:0.875rem;line-height:1.5;background:#0d1117;color:#c9d1d9}.code-block.svelte-1pkdv5j code.svelte-1pkdv5j{font-family:'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace}.cb-command{color:#7ee787}.cb-comment{color:#8b949e}.line-numbers.svelte-1pkdv5j.svelte-1pkdv5j{counter-reset:line}.line-numbers.svelte-1pkdv5j code.svelte-1pkdv5j{counter-increment:line}.line-numbers.svelte-1pkdv5j code.svelte-1pkdv5j::before{content:counter(line);display:inline-block;width:2rem;margin-right:1rem;text-align:right;color:#6e7681}",
  map: null
};
const CodeBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { code } = $$props;
  let { language = "bash" } = $$props;
  let { showLineNumbers = false } = $$props;
  let highlightedCode = "";
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
  return `<div class="code-block-wrapper svelte-1pkdv5j"><pre class="${["code-block svelte-1pkdv5j", showLineNumbers ? "line-numbers" : ""].join(" ").trim()}"><code class="svelte-1pkdv5j"><!-- HTML_TAG_START -->${highlightedCode}<!-- HTML_TAG_END --></code></pre> </div>`;
});
export {
  CodeBlock as C
};
