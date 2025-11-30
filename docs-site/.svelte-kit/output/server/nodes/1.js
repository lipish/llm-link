

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.f0057d32.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/stores.5260e6e4.js","_app/immutable/chunks/singletons.dc235144.js","_app/immutable/chunks/paths.02c97ffe.js"];
export const stylesheets = [];
export const fonts = [];
