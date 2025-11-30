

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/architecture/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.e9f410c3.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/CodeBlock.fdbad5f1.js","_app/immutable/chunks/paths.e5c13239.js","_app/immutable/chunks/layers.5ebc050c.js","_app/immutable/chunks/Icon.d16ecb08.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
