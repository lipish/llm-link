import * as universal from '../entries/pages/docs/_page.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/docs/+page.js";
export const imports = ["_app/immutable/nodes/4.17655a69.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/paths.a1e3c374.js","_app/immutable/chunks/check.5c7eac0f.js","_app/immutable/chunks/zap.ac426999.js","_app/immutable/chunks/terminal.de9394d9.js"];
export const stylesheets = [];
export const fonts = [];
