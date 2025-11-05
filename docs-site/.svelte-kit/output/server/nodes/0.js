

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.64a9d005.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.982f69d2.js","_app/immutable/chunks/singletons.fa9f8169.js","_app/immutable/chunks/paths.f1216fa5.js","_app/immutable/chunks/github.eb49a4d0.js","_app/immutable/chunks/external-link.112d13ed.js"];
export const stylesheets = ["_app/immutable/assets/0.8940f397.css"];
export const fonts = [];
