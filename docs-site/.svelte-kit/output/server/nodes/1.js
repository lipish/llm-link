

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.02d4fe82.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.d0b0326d.js","_app/immutable/chunks/singletons.fcfe6dbb.js","_app/immutable/chunks/paths.26f88e6c.js"];
export const stylesheets = [];
export const fonts = [];
