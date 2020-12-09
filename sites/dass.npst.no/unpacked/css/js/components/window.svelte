<script lang="ts">
	import { scale } from "svelte/transition";
	import movable from "../utils/movable";
	import type { MoveEvent } from "../utils/movable";
	import Button from "./button.svelte";
	import { apps } from "../store";
	import { onMount } from "svelte";

	export let shadow: boolean = true;
	export let resizable: boolean = true;
	export let windowTitle: string = "Ikke navngitt vindu";
	export let id: string;
	export let order: number;
	export let width: number = 500;
	export let height: number = 300;

	let self = $apps.find((a) => a.id === id);
	let thisWindow: HTMLElement;
	$: hasFocus = order === $apps.length - 1;

	let thisWindowWidth: number = 0;
	let thisWindowHeight: number = 0;
	let globalWindowWidth: number = 0;
	let globalWindowHeight: number = 0;

	$: dynamicStyle = `
		z-index: ${10 + order};
		transform: translate(${self?.pos[0]}px, ${self?.pos[1]}px);
		width: ${width}px;
		height: ${height}px;
	`;

	function handleDrag(event: MoveEvent) {
		if (!self) return;
		self.pos = [
			Math.max(
				0,
				Math.min(
					self.pos[0] + event.detail.dx,
					globalWindowWidth - thisWindowWidth
				)
			),
			Math.max(
				0,
				Math.min(
					self.pos[1] + event.detail.dy,
					globalWindowHeight - thisWindowHeight
				)
			),
		];
	}

	function handleResize(event: MoveEvent) {
		width = Math.max(200, Math.min(width + event.detail.dx, globalWindowWidth));

		height = Math.max(
			100,
			Math.min(height + event.detail.dy, globalWindowHeight - 80)
		);
	}

	onMount(() => {
		// Fix iframe overlay preventing scroll in Safari
		let iframe = thisWindow.querySelector("iframe");
		if (iframe) iframe.style.zIndex = "-1";
	});
</script>

<svelte:window
	bind:innerHeight={globalWindowHeight}
	bind:innerWidth={globalWindowWidth} />

<section
	class:shadow
	in:scale
	bind:offsetWidth={thisWindowWidth}
	bind:offsetHeight={thisWindowHeight}
	bind:this={thisWindow}
	on:mousedown={() => apps.focus(id)}
	data-active={hasFocus}
	style={dynamicStyle}>
	<header use:movable on:move={handleDrag}>
		<div class="title">{windowTitle}</div>
		<div class="actions">
			<Button>?</Button>
			<Button on:click={() => apps.close(id)}>X</Button>
		</div>
	</header>
	<div class="toolbar">
		<slot name="toolbar" />
		{#if $$slots.toolbar}
			<hr />
		{/if}
	</div>
	<article class="content">
		<slot name="content" />
	</article>
	<div class="resizable">
		{#if resizable}<span use:movable on:move={handleResize} />{/if}
	</div>
	{#if !hasFocus}
		<div class="overlay" />
	{/if}
</section>

<style>
	section {
		position: fixed !important; /** wiered safari bug */
		padding: 4px;
		font-size: 1rem;

		border: 2px solid;
		border-color: var(--border-light) var(--border-darkest)
			var(--border-darkest) var(--border-light);
		box-shadow: inset 1px 1px 0px 1px var(--border-lightest),
			inset -1px -1px 0 1px var(--border-dark);

		box-sizing: border-box;
		display: inline-block;
		background: var(--material);
		color: var(--material-text);

		user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;

		min-width: 200px;
		min-height: 100px;
		overflow: hidden;

		display: grid;
		grid-template-rows: auto auto 1fr auto;
	}

	.toolbar > hr {
		border-bottom: 1px solid var(--border-lightest);
		border-top: 1px solid var(--border-dark);
		margin: 0;
	}

	article.content {
		overflow: hidden;
		padding: 1rem;
	}

	section.shadow {
		box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.35),
			inset 1px 1px 0px 1px var(--border-lightest),
			inset -1px -1px 0 1px var(--border-dark);
	}

	div.overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	header {
		padding: 0.2rem;
		font-weight: bold;
		border: 2px solid var(--material);
		display: flex;
		background: var(--header-not-active-background);
		color: var(--header-not-active-text);
		overflow: hidden;
	}

	header > .actions {
		background-color: inherit;
		padding-left: 5px;
	}

	header > .title {
		flex: 1;
		display: flex;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
	}

	[data-active="true"] > header {
		background: var(--header-background);
		color: var(--header-text);
	}

	span {
		float: right;
		width: 25px;
		height: 25px;
		background-image: linear-gradient(
			135deg,
			var(--border-lightest) 16.67%,
			var(--material) 16.67%,
			var(--material) 33.33%,
			var(--border-dark) 33.33%,
			var(--border-dark) 50%,
			var(--border-lightest) 50%,
			var(--border-lightest) 66.67%,
			var(--material) 66.67%,
			var(--material) 83.33%,
			var(--border-dark) 83.33%,
			var(--border-dark) 100%
		);
		background-size: 8.49px 8.49px;
		clip-path: polygon(100% 0px, 0px 100%, 100% 100%);
		cursor: nwse-resize;
	}
</style>
