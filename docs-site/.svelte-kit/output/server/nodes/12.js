

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/quick-start/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.82691e76.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/CodeBlock.818897d2.js","_app/immutable/chunks/Accordion.010092b3.js","_app/immutable/chunks/Icon.c150d722.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css","_app/immutable/assets/Accordion.6eea8b9c.css"];
export const fonts = [];
