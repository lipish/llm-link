

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.814ccc35.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/stores.5260e6e4.js","_app/immutable/chunks/singletons.dc235144.js","_app/immutable/chunks/paths.02c97ffe.js","_app/immutable/chunks/button.3755bcca.js","_app/immutable/chunks/Icon.c150d722.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/external-link.379cecd4.js"];
export const stylesheets = ["_app/immutable/assets/0.79d1b774.css"];
export const fonts = [];
