

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.1d1868e4.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.d0b0326d.js","_app/immutable/chunks/singletons.fcfe6dbb.js","_app/immutable/chunks/paths.26f88e6c.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/external-link.112d13ed.js"];
export const stylesheets = ["_app/immutable/assets/0.1cfaa3d8.css"];
export const fonts = [];
