<script lang="ts">
	import Button from "../components/button.svelte";
	import Window from "../components/window.svelte";
	import Cutout from "../components/cutout.svelte";
	import { onDestroy } from "svelte";
	import { apps, servicePack } from "../store";
	import Alert from "./alert.svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;

	export let servicePackNumber: number;

	let progress = 0;
	let complete = false;
	$: acc = progress * 0.005;

	function updateProgress() {
		progress++;

		if (progress >= 100) {
			progress = 100;
			complete = true;
			servicePack.update(servicePackNumber);
			apps.open({
				component: Alert,
				id: id + "_alert",
				parent: id,
				props: {
					title: "Installering vellykket",
					message: `Tjenestepakke ${servicePackNumber} er nå installert`,
					severity: "success",
					closeCallback: () => apps.close(id),
				},
			});
		}
	}

	const interval = setInterval(() => {
		if (complete) return;
		progress -= acc;
		if (progress < 0) progress = 0;
	}, 100);

	onDestroy(() => clearInterval(interval));
</script>

<Window
	windowTitle="🎁 Tjenestepakkeinstalleringsverktøy"
	width={550}
	height={350}
	{id}
	{order}>
	<div slot="content" class="wrapper">
		<h2>Tjenestepakke {servicePackNumber} er tilgjengelig!</h2>
		<div
			id="progress"
			style="--progress-clip: polygon({progress}% 0, 100% 0, 100% 100%, {progress}% 100%);">
			<Cutout>
				<div><span>{progress.toFixed(1)}%</span></div>
				<div><span>{progress.toFixed(1)}%</span></div>
			</Cutout>
		</div>
		<span />
		<Button primary fullWidth on:click={updateProgress}>Installer</Button>
	</div>
</Window>

<style>
	.wrapper {
		display: grid;
		grid-template-rows: auto 40px 1fr auto;
		height: 100%;
	}

	#progress {
		position: relative;
	}

	#progress div {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#progress div:first-of-type {
		background: var(--progress);
		color: var(--canvas);
	}

	#progress div:last-of-type {
		background: var(--canvas);
		color: var(--canvas-text);
		clip-path: var(--progress-clip);
	}

	h2 {
		text-align: center;
	}
</style>
