

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.b7921cbc.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.e8a1545b.js","_app/immutable/chunks/singletons.fe8a2c51.js","_app/immutable/chunks/paths.a1e3c374.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/external-link.112d13ed.js"];
export const stylesheets = ["_app/immutable/assets/0.1cfaa3d8.css"];
export const fonts = [];
