import * as universal from '../entries/pages/_page.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/3.1c7916e5.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/button.5ceb39f9.js","_app/immutable/chunks/Icon.d16ecb08.js","_app/immutable/chunks/CodeBlock.fdbad5f1.js","_app/immutable/chunks/paths.e5c13239.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
