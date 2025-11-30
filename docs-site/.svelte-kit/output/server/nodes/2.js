

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.5925a839.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/stores.5260e6e4.js","_app/immutable/chunks/singletons.dc235144.js","_app/immutable/chunks/paths.02c97ffe.js"];
export const stylesheets = ["_app/immutable/assets/2.a63b4f26.css"];
export const fonts = [];
