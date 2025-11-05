

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.f086413e.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js","_app/immutable/chunks/stores.982f69d2.js","_app/immutable/chunks/singletons.fa9f8169.js","_app/immutable/chunks/paths.f1216fa5.js"];
export const stylesheets = [];
export const fonts = [];
