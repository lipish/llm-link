import * as universal from '../entries/pages/providers/_page.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/providers/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/providers/+page.js";
export const imports = ["_app/immutable/nodes/5.f75fe42c.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/check.5c7eac0f.js","_app/immutable/chunks/external-link.112d13ed.js"];
export const stylesheets = [];
export const fonts = [];
