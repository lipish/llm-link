export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/api": [4],
		"/docs": [5,[2]],
		"/docs/apps/aider": [6,[2]],
		"/docs/apps/codex": [7,[2]],
		"/docs/apps/openhands": [8,[2]],
		"/docs/apps/zed": [9,[2]],
		"/docs/architecture": [10,[2]],
		"/docs/protocols": [11,[2]],
		"/docs/quick-start": [12,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';