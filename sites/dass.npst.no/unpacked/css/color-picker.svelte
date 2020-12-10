<script lang="ts">import Button from "../../components/button.svelte";
import Cutout from "../../components/cutout.svelte";
import colors from "./colors";
import state from "./store";
function changeColor(color) {
    $state.primaryColor = color;
}
function swapColors() {
    [$state.primaryColor, $state.secondaryColor] = [
        $state.secondaryColor,
        $state.primaryColor,
    ];
}
</script>

<section style="--width: {Math.ceil(colors.length / 2) * 25}px;">
	<button class="preview" on:click={swapColors}>
		<Cutout>
			<div class="secondary">
				<Cutout scrollable={false}>
					<span style="background: rgb({$state.secondaryColor.join(',')});" />
				</Cutout>
			</div>
			<div class="primary">
				<Cutout scrollable={false}>
					<span style="background: rgb({$state.primaryColor.join(',')});" />
				</Cutout>
			</div>
		</Cutout>
	</button>
	{#each colors as color}
		<div class="wrapper">
			<Cutout scrollable={false}>
				<button
					class="color"
					style="background: rgb({color.join(',')});"
					on:click={() => changeColor(color)} />
			</Cutout>
		</div>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-flow: column wrap;
		height: 50px;
		width: var(--width);
	}

	.preview {
		height: 100%;
		width: 50px;
		position: relative;
		border: none;
		margin-right: 5px;
	}

	.preview div {
		position: absolute;
		width: 25px;
		height: 25px;
	}

	.primary {
		top: 5px;
		left: 5px;
	}

	.secondary {
		bottom: 5px;
		right: 5px;
	}

	.preview span {
		display: block;
		width: 100%;
		height: 100%;
	}

	.wrapper {
		width: 25px;
		height: 25px;
	}

	button {
		width: 100%;
		height: 100%;
		border: none;
		padding: 0;
	}
</style>
