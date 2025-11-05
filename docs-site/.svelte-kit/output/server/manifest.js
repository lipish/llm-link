export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "llm-link/_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.ee69f2ef.js","app":"_app/immutable/entry/app.8fc7bfdf.js","imports":["_app/immutable/entry/start.ee69f2ef.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/singletons.fa9f8169.js","_app/immutable/chunks/paths.f1216fa5.js","_app/immutable/entry/app.8fc7bfdf.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
