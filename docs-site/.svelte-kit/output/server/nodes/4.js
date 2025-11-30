

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.b0d42eed.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/button.3755bcca.js","_app/immutable/chunks/Icon.c150d722.js","_app/immutable/chunks/CodeBlock.818897d2.js","_app/immutable/chunks/paths.02c97ffe.js","_app/immutable/chunks/github.8905adfa.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
