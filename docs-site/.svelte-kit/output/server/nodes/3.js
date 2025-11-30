import * as universal from '../entries/pages/_page.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/3.1b1298e9.js","_app/immutable/chunks/scheduler.f4350b81.js","_app/immutable/chunks/index.9ea6f852.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/button.3755bcca.js","_app/immutable/chunks/Icon.c150d722.js","_app/immutable/chunks/CodeBlock.818897d2.js","_app/immutable/chunks/paths.02c97ffe.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
