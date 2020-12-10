<script lang="ts">
	import SystemSettings from "../apps/system-settings.svelte";
	import { clock, apps } from "../store";
	import Cutout from "./cutout.svelte";

	$: dateString = $clock.user.toLocaleString("no", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
	$: timeString = $clock.user.toLocaleString("no", {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});

	let lastClick = 0;
	function onClick() {
		let now = new Date().getTime();
		if (now - lastClick < 200) {
			lastClick = 0;
			apps.open({
				id: "app-system-settings",
				component: SystemSettings,
			});
		} else {
			lastClick = now;
		}
	}
</script>

<div on:mousedown={onClick}>
	<Cutout scrollable={false}>
		<p>{timeString}</p>
		<p>{dateString}</p>
	</Cutout>
</div>

<style>
	div {
		position: absolute;
		right: 0.5em;
		top: 0.2em;
		bottom: 0.2em;
		cursor: pointer;
	}

	p {
		text-align: center;
		margin: 0;
		padding: 0 0.2em;
		user-select: none;
	}

	p:first-child {
		margin-bottom: 0.2em;
	}
</style>
