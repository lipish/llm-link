import * as universal from '../entries/pages/docs/_page.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/docs/+page.js";
export const imports = ["_app/immutable/nodes/5.8601f02e.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/button.5ceb39f9.js","_app/immutable/chunks/Icon.d16ecb08.js","_app/immutable/chunks/Accordion.b368c0a3.js","_app/immutable/chunks/paths.e5c13239.js","_app/immutable/chunks/github.725c1cb5.js","_app/immutable/chunks/layers.5ebc050c.js","_app/immutable/chunks/external-link.2d94bb38.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css","_app/immutable/assets/Accordion.6eea8b9c.css"];
export const fonts = [];
