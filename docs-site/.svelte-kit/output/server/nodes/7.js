

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/apps/codex/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.318130cd.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js","_app/immutable/chunks/CodeBlock.fdbad5f1.js","_app/immutable/chunks/paths.e5c13239.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.bfbaa69e.css"];
export const fonts = [];
