import * as universal from '../entries/pages/providers/_page.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/providers/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/providers/+page.js";
export const imports = ["_app/immutable/nodes/4.8aabb879.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/external-link.112d13ed.js"];
export const stylesheets = [];
export const fonts = [];
