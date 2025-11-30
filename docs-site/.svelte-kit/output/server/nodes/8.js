

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/apps/openhands/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.70b49d50.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/paths.e5c13239.js","_app/immutable/chunks/CodeBlock.fdbad5f1.js","_app/immutable/chunks/Badge.e3736bb7.js","_app/immutable/chunks/Icon.d16ecb08.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
