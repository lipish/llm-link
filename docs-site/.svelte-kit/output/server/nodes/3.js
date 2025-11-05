

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.b85ee726.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/paths.26f88e6c.js","_app/immutable/chunks/terminal.de9394d9.js","_app/immutable/chunks/zap.ac426999.js"];
export const stylesheets = [];
export const fonts = [];
