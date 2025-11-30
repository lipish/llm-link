

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.175026f8.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/button.5ceb39f9.js","_app/immutable/chunks/Icon.d16ecb08.js","_app/immutable/chunks/CodeBlock.fdbad5f1.js","_app/immutable/chunks/paths.e5c13239.js","_app/immutable/chunks/github.725c1cb5.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
