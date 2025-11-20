import * as universal from '../entries/pages/providers/_page.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/providers/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/providers/+page.js";
export const imports = ["_app/immutable/nodes/5.1f76ce0a.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.7577e3fb.js","_app/immutable/chunks/Icon.b2256389.js","_app/immutable/chunks/Accordion.5f46c035.js","_app/immutable/chunks/github.ea9e1a80.js","_app/immutable/chunks/external-link.b4f90242.js"];
export const stylesheets = ["_app/immutable/assets/Accordion.6eea8b9c.css"];
export const fonts = [];
