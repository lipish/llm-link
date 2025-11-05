

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.e0adbfa4.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.4a2178e8.js","_app/immutable/chunks/singletons.fc354b9e.js","_app/immutable/chunks/paths.d75b54b9.js"];
export const stylesheets = [];
export const fonts = [];
