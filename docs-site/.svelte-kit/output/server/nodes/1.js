

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.80ed2f3a.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.7577e3fb.js","_app/immutable/chunks/stores.581d912b.js","_app/immutable/chunks/singletons.d3d6a68d.js","_app/immutable/chunks/paths.0b0c7f75.js"];
export const stylesheets = [];
export const fonts = [];
