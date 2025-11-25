<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';
	import bash from 'highlight.js/lib/languages/bash';
	import rust from 'highlight.js/lib/languages/rust';
	import yaml from 'highlight.js/lib/languages/yaml';
	import json from 'highlight.js/lib/languages/json';
	import 'highlight.js/styles/github-dark.css';

	export let code: string;
	export let language: string = 'bash';
	export let showLineNumbers: boolean = false;

	let highlightedCode = '';
let copied = false;
let copyTimer: ReturnType<typeof setTimeout> | null = null;
let wrapperRef: HTMLDivElement | null = null;

	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('rust', rust);
	hljs.registerLanguage('yaml', yaml);
	hljs.registerLanguage('json', json);

	function highlightBashCommands(source: string): string {
		return source
			.split('\n')
			.map((line) => {
				const trimmed = line.trimStart();
				if (trimmed.startsWith('#')) {
					// Comment line
					return `<span class=\"cb-comment\">${line}</span>`;
				}


				// Highlight first token (command) on non-empty lines
				const leadingSpaces = line.match(/^\s*/)?.[0] ?? '';
				const rest = line.slice(leadingSpaces.length);
				if (!rest) return line;

				const [cmd, ...args] = rest.split(' ');
				const highlightedLine = `${leadingSpaces}<span class=\"cb-command\">${cmd}</span>${args.length ? ' ' + args.join(' ') : ''}`;
				return highlightedLine;
			})
			.join('\n');
	}

	onMount(() => {
		try {
			if (language === 'bash') {
				// Use a minimal custom highlighter for shell commands
				highlightedCode = highlightBashCommands(code);
			} else {
				const result = hljs.highlight(code, { language });
				highlightedCode = result.value;
			}
		} catch (e) {
			highlightedCode = code;
		}
	});

	function fallbackCopy(text: string) {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.top = '-9999px';
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		document.execCommand('copy');
		textarea.remove();
	}

	function triggerCopiedFeedback() {
		if (copyTimer) {
			clearTimeout(copyTimer);
		}
		copied = true;
		copyTimer = setTimeout(() => (copied = false), 2000);
	}

	async function copyToClipboard() {
		const textToCopy = code;

		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(textToCopy);
			} else {
				fallbackCopy(textToCopy);
			}
		} catch (err) {
			fallbackCopy(textToCopy);
		}

		triggerCopiedFeedback();
	}
</script>

<div class="code-block-wrapper" bind:this={wrapperRef}>
	<button class="copy-button" type="button" on:click={copyToClipboard} aria-label="Copy code">
		{#if copied}
			<span>Copied</span>
		{:else}
			<span>Copy</span>
		{/if}
	</button>
	<pre class="code-block" class:line-numbers={showLineNumbers}><code>{@html highlightedCode}</code></pre>
</div>

<style>
	.code-block-wrapper {
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		background: #0d1117;
	}

	.copy-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(255, 255, 255, 0.08);
		color: #e6edf3;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		cursor: pointer;
		transition: background 0.2s ease;
		user-select: none;
	}

	.copy-button:hover {
		background: rgba(255, 255, 255, 0.18);
	}

	.copy-button:focus-visible {
		outline: 2px solid #60a5fa;
		outline-offset: 2px;
	}

	.code-block {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.5;
		background: #0d1117;
		color: #c9d1d9;
		user-select: text;
	}

	.code-block code {
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
		user-select: text;
	}

	:global(.cb-command) {
		color: #7ee787; /* subtle green for command name */
	}

	:global(.cb-comment) {
		color: #8b949e; /* muted gray for comments */
	}

	.line-numbers {
		counter-reset: line;
	}

	.line-numbers code {
		counter-increment: line;
	}

	.line-numbers code::before {
		content: counter(line);
		display: inline-block;
		width: 2rem;
		margin-right: 1rem;
		text-align: right;
		color: #6e7681;
	}
</style>
