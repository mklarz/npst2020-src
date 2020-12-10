<script lang="ts">
	import Button from "../../components/button.svelte";
	import Cutout from "../../components/cutout.svelte";
	import tools from "./tools";
	import state from "./store";

	$: currentTool = tools.find((t) => t.name === $state.currentTool);
</script>

<section>
	<div class="tools">
		{#each tools as tool}
			<Button
				indented={$state.currentTool === tool.name}
				on:click={() => ($state.currentTool = tool.name)}>
				{tool.icon}
			</Button>
		{/each}
	</div>
	{#if currentTool?.settings}
		<Cutout>
			<svelte:component this={currentTool.settings} />
		</Cutout>
	{/if}
</section>

<style>
	.tools {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: 2.5rem;
		margin-bottom: 10px;
	}
</style>
