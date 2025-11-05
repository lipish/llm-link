export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.3ceaaff2.js","app":"_app/immutable/entry/app.3094c276.js","imports":["_app/immutable/entry/start.3ceaaff2.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/singletons.fc354b9e.js","_app/immutable/chunks/paths.d75b54b9.js","_app/immutable/entry/app.3094c276.js","_app/immutable/chunks/scheduler.5d594c60.js","_app/immutable/chunks/index.1d3f9147.js"],"stylesheets":[],"fonts":[]},
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
