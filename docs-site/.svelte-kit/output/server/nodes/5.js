import * as universal from '../entries/pages/docs/_page.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/docs/+page.js";
export const imports = ["_app/immutable/nodes/5.4ceb1dac.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/button.3755bcca.js","_app/immutable/chunks/Icon.c150d722.js","_app/immutable/chunks/Accordion.010092b3.js","_app/immutable/chunks/paths.02c97ffe.js","_app/immutable/chunks/github.8905adfa.js","_app/immutable/chunks/layers.307c17b9.js","_app/immutable/chunks/external-link.379cecd4.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css","_app/immutable/assets/Accordion.6eea8b9c.css"];
export const fonts = [];
