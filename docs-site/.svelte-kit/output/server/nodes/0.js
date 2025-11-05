

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.f76f7216.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.4a2178e8.js","_app/immutable/chunks/singletons.fc354b9e.js","_app/immutable/chunks/paths.d75b54b9.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/external-link.112d13ed.js"];
export const stylesheets = ["_app/immutable/assets/0.4e79fa8c.css"];
export const fonts = [];
