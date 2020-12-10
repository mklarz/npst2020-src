<script lang="ts">import { onDestroy } from "svelte";
export let active = false;
export let disabled = false;
export let name;
let handleClick = () => {
    if (!active) {
        active = true;
        window.addEventListener("mouseup", handleClick);
    }
    else {
        active = false;
        window.removeEventListener("mouseup", handleClick);
    }
};
onDestroy(() => window.removeEventListener("click", handleClick));
</script>

<button class:active on:click={handleClick} {disabled}>
	{name}
	{#if active}
		<span><slot /></span>
	{/if}
</button>

<style>
	button {
		position: relative;
		box-sizing: border-box;
		display: inline-block;
		background: var(--material);
		color: var(--material-text);
		border: 2px solid transparent;
		padding: 2px calc(2px + 0.4em);
		cursor: pointer;
		font-size: 1rem;
	}

	button:hover:not(:disabled):not(.active) {
		border-left-color: var(--border-lightest);
		border-top-color: var(--border-lightest);
		border-right-color: var(--border-dark);
		border-bottom-color: var(--border-dark);
	}

	button:active:hover:not(:disabled),
	.active {
		border-left-color: var(--border-dark);
		border-top-color: var(--border-dark);
		border-right-color: var(--border-lightest);
		border-bottom-color: var(--border-lightest);
	}

	button:disabled {
		cursor: initial;
		/* -webkit-text-fill-color: var(--material-text-disabled); */
		color: var(--material-text-disabled);
		text-shadow: 1px 1px var(--material-text-disabled-shadow);
	}

	span {
		position: absolute;
		left: 0;
		top: 100%;
		z-index: 100;
	}
</style>
