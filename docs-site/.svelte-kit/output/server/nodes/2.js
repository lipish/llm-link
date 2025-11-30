

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.46417898.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/stores.4552ebb9.js","_app/immutable/chunks/singletons.b696c843.js","_app/immutable/chunks/paths.e5c13239.js"];
export const stylesheets = ["_app/immutable/assets/2.a63b4f26.css"];
export const fonts = [];
