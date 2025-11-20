import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.45973ef9.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.7577e3fb.js","_app/immutable/chunks/Icon.b2256389.js","_app/immutable/chunks/CodeBlock.33745d53.js","_app/immutable/chunks/Accordion.5f46c035.js","_app/immutable/chunks/paths.0b0c7f75.js","_app/immutable/chunks/github.ea9e1a80.js","_app/immutable/chunks/zap.0ee4b119.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.3291e38a.css","_app/immutable/assets/Accordion.6eea8b9c.css"];
export const fonts = [];
