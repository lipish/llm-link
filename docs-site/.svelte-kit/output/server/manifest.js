export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "llm-link/_app",
	assets: new Set(["architecture.jpeg","architecture.png","favicon.ico","favicon.png","llmlink.jpg"]),
	mimeTypes: {".jpeg":"image/jpeg",".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.2a826a36.js","app":"_app/immutable/entry/app.f914b9e2.js","imports":["_app/immutable/entry/start.2a826a36.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/singletons.b696c843.js","_app/immutable/chunks/paths.e5c13239.js","_app/immutable/entry/app.f914b9e2.js","_app/immutable/chunks/scheduler.2b9f022a.js","_app/immutable/chunks/index.6ae5f468.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js'))
		],
		routes: [
			{
				id: "/api",
				pattern: /^\/api\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/docs/apps/aider",
				pattern: /^\/docs\/apps\/aider\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/docs/apps/codex",
				pattern: /^\/docs\/apps\/codex\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/docs/apps/openhands",
				pattern: /^\/docs\/apps\/openhands\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/docs/apps/zed",
				pattern: /^\/docs\/apps\/zed\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/docs/architecture",
				pattern: /^\/docs\/architecture\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/docs/protocols",
				pattern: /^\/docs\/protocols\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/docs/quick-start",
				pattern: /^\/docs\/quick-start\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
