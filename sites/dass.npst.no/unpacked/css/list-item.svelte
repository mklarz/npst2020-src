<script lang="ts">export let size = "lg";
export let disabled = false;
</script>

<li class={size} class:disabled on:mouseup>
	<slot />
</li>

<style>
	li {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 8px;
		font-size: 1rem;
		white-space: nowrap;
		justify-content: space-between;
		text-align: center;
		/* line-height: ${props => blockSizes[props.size]}; */
		color: var(--material-text);
	}

	.disabled {
		pointer-events: none;
		cursor: initial;
		color: var(--material-text-disabled);
		text-shadow: 1px 1px var(--material-text-disabled-shadow);
	}

	li:hover:not(.disabled) {
		color: var(--material-text-invert);
		background: var(--hover-background);
		cursor: default;
	}

	.sm {
		padding: 2px calc(2px + 0.5em);
	}

	.md {
		padding: calc(2px + 0.15em) calc(2px + 0.5em);
	}

	.lg {
		padding: calc(2px + 1em) calc(2px + 0.5em);
	}
</style>
