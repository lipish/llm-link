

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.a1b50edb.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.7577e3fb.js","_app/immutable/chunks/stores.581d912b.js","_app/immutable/chunks/singletons.d3d6a68d.js","_app/immutable/chunks/paths.0b0c7f75.js","_app/immutable/chunks/Icon.b2256389.js","_app/immutable/chunks/external-link.b4f90242.js"];
export const stylesheets = ["_app/immutable/assets/0.4f964a3e.css"];
export const fonts = [];
