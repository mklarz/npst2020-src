<script lang="ts">import Hourglass from "./hourglass.svelte";
export let loading = false;
</script>

<section>
	<nav>
		<slot />
	</nav>
	{#if loading}
		<span>
			<Hourglass />
		</span>
	{/if}
</section>

<style>
	section {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
	}

	span {
		margin: 0 1em;
	}

	nav {
		position: relative;
		display: flex;
		align-items: center;
		padding: 4px;
	}
</style>
