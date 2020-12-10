<script lang="ts">import state from "../store";
const sizes = [1, 2, 4, 8];
</script>

<section>
	{#each sizes as size}
		<button
			class:active={$state.brushSize === size}
			on:click={() => ($state.brushSize = size)}>
			<span style="height: {size}px" />
		</button>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
	}

	button {
		border: none;
		width: 100%;
		height: 2rem;
		align-items: center;
	}

	.active {
		background: var(--hover-background);
		color: var(--canvas-text-invert);
	}

	span {
		display: block;
		width: 100%;
		background: black;
	}

	.active span {
		background: white;
	}
</style>
