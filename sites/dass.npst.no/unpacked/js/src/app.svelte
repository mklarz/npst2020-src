<script lang="ts">
	import Email from "./apps/email.svelte";
	import Enhance from "./apps/enhance.svelte";
	import Information from "./apps/information.svelte";
	import Paint from "./apps/paint/paint.svelte";
	import Run from "./apps/run.svelte";
	import Scoreboard from "./apps/scoreboard.svelte";
	import Hourglass from "./components/hourglass.svelte";
	import KernelPanic from "./components/kernel-panic.svelte";
	import Taskbar from "./components/taskbar.svelte";
	import {
		apps,
		kernelPanic,
		loading,
		background,
		servicePack,
		snowing,
	} from "./store";
	import type { NewApplication } from "./store";
	import { authenticate } from "./utils/authentication";
	import ServicePackInstaller from "./apps/service-pack-installer.svelte";
	import Snow from "./components/snow.svelte";

	const startMenuApps: {
		application: NewApplication;
		name: string;
		requireLogin: boolean;
		requireSP?: number;
	}[] = [
		{
			name: "📯 Snabel-A",
			requireLogin: true,
			application: {
				component: Email,
				id: "app-email",
			},
		},
		{
			name: "🏆 Poengoversikt",
			requireLogin: false,
			application: {
				component: Scoreboard,
				id: "app-scoreboard",
			},
		},
		{
			name: "✨ Forbedre",
			requireLogin: true,
			application: {
				component: Enhance,
				id: "app-enhance",
			},
		},
		{
			name: "🎨 Mal",
			requireLogin: true,
			application: {
				component: Paint,
				id: "app-paint",
			},
			requireSP: 1,
		},
		{
			name: "ℹ Informasjon",
			requireLogin: false,
			application: {
				component: Information,
				id: "app-information",
			},
		},
		{
			name: "🚓 Kjør...",
			requireLogin: true,
			application: {
				component: Run,
				id: "app-run",
			},
		},
	];

	let authPromise = authenticate().then((isLoggedIn) => {
		if (!isLoggedIn) {
			apps.open({
				component: Information,
				id: "app-information",
			});
		} else {
			const uninstalledServicePack = startMenuApps
				.map((s) => s.requireSP)
				.filter((v) => v !== undefined && v > $servicePack)
				.reduce((prev, curr) => Math.max(prev || 0, curr || 0), 0);

			if (uninstalledServicePack) {
				apps.open({
					component: ServicePackInstaller,
					id: "app-service-pack-installer",
					props: {
						servicePackNumber: uninstalledServicePack,
					},
				});
			}
		}
	});
	loading.waitForPromise(authPromise);

	$: availableApps = startMenuApps.filter(
		(s) => (s.requireSP || 0) <= $servicePack
	);
</script>

<svelte:head>
	<title>DASS {($loading && 'svarer ikke...') || ''}</title>
</svelte:head>

{#if $loading}
	<div id="not-responding">
		<Hourglass />
	</div>
{/if}

<main style={$background ? `background-image: url(${$background});` : ''}>
	{#if $snowing}
		<Snow />
	{/if}
	{#if $kernelPanic}
		<KernelPanic />
	{:else}
		{#await authPromise then _}
			<Taskbar startMenuApps={availableApps} />
			<!-- Optimizing for less window repaints -->
			{#each $apps
				.map((app, index) => ({ ...app, index }))
				.sort((a, b) => a.id.localeCompare(b.id)) as app (app.id)}
				<svelte:component
					this={app.component}
					id={app.id}
					order={app.index}
					{...app.props} />
			{/each}
		{:catch err}
			<p>Error {err}</p>
		{/await}
	{/if}
</main>

<style>
	main {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	#not-responding {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(255, 255, 255, 0.4);
		font-size: 4rem;
		z-index: 999999999999;
	}

	/* Prevent white background on apple's scroll bounce effect */
	:global(body) {
		background-color: firebrick;
	}

	/* Theme from https://github.com/arturbien/React95/blob/master/src/common/themes/original.js */
	:global(:root) {
		--anchor: #1034a6;
		--anchor-visited: #440381;
		--border-dark: #848584;
		--border-darkest: #0a0a0a;
		--border-light: #dfdfdf;
		--border-lightest: #fefefe;
		--canvas: #ffffff;
		--canvas-text: #0a0a0a;
		--canvas-text-disabled: #848584;
		--canvas-text-disabled-shadow: #fefefe;
		--canvas-text-invert: #fefefe;
		--checkmark: #0a0a0a;
		--checkmark-disabled: #848584;
		--flat-dark: #9e9e9e;
		--flat-light: #d8d8d8;
		--focus-secondary: #fefe03;
		--header-background: #060084;
		--header-not-active-background: #7f787f;
		--header-not-active-text: #c6c6c6;
		--header-text: #fefefe;
		--hover-background: #060084;
		--material: #c6c6c6;
		--material-dark: #9a9e9c;
		--material-text: #0a0a0a;
		--material-text-disabled: #848584;
		--material-text-disabled-shadow: #fefefe;
		--material-text-invert: #fefefe;
		--progress: #060084;
		--tooltip: #fefbcc;
	}
</style>
