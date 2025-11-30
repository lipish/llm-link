

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/quick-start/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.10ddbbec.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/CodeBlock.fdbad5f1.js","_app/immutable/chunks/Accordion.b368c0a3.js","_app/immutable/chunks/Icon.d16ecb08.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css","_app/immutable/assets/Accordion.6eea8b9c.css"];
export const fonts = [];
