

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.9b97306a.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.7577e3fb.js","_app/immutable/chunks/Icon.b2256389.js","_app/immutable/chunks/CodeBlock.33745d53.js","_app/immutable/chunks/paths.0b0c7f75.js","_app/immutable/chunks/settings.5d8e8ec2.js","_app/immutable/chunks/github.ea9e1a80.js"];
export const stylesheets = ["_app/immutable/assets/CodeBlock.3291e38a.css"];
export const fonts = [];
