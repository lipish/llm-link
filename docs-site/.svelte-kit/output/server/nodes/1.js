

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.1fb6d344.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/stores.4552ebb9.js","_app/immutable/chunks/singletons.b696c843.js","_app/immutable/chunks/paths.e5c13239.js"];
export const stylesheets = [];
export const fonts = [];
