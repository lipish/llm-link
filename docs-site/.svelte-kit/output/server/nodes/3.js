

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.f6ffffa9.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/zap.3b6d2092.js"];
export const stylesheets = [];
export const fonts = [];
