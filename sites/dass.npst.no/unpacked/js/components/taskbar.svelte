<script lang="ts">
	import { onDestroy } from "svelte";
	import { user, apps } from "../store";
	import type { NewApplication } from "../store";
	import Button from "./button.svelte";
	import Toolbar from "./toolbar.svelte";
	import List from "./list.svelte";
	import ListItem from "./list-item.svelte";
	import ListDivider from "./list-divider.svelte";
	import Login from "../apps/login.svelte";
	import Logout from "../apps/logout.svelte";
	import Clock from "./clock.svelte";

	export let startMenuApps: {
		application: NewApplication;
		name: string;
		requireLogin: boolean;
	}[] = [];

	let active: boolean = false;

	const handleClick = () => {
		if (!active) {
			active = true;
			window.addEventListener("mouseup", handleClick);
		} else {
			active = false;
			window.removeEventListener("mouseup", handleClick);
		}
	};

	onDestroy(() => window.removeEventListener("click", handleClick));
</script>

<header>
	<Toolbar>
		<Button size="lg" on:click={handleClick} bind:indented={active}>
			🧻
			<b>Start</b>
		</Button>
		<Clock />
		{#if active}
			<span>
				<List>
					{#each startMenuApps as app (app.application.id)}
						<ListItem
							disabled={app.requireLogin && !$user}
							on:mouseup={() => !(app.requireLogin && !$user) && apps.open(app.application)}>
							{app.name}
						</ListItem>
					{/each}
					<ListDivider />
					{#if $user}
						<ListItem
							on:mouseup={() => apps.open({
									component: Logout,
									id: 'app-logout',
								})}>
							Logg ut
						</ListItem>
					{:else}
						<ListItem
							on:mouseup={() => apps.open({
									component: Login,
									id: 'app-login',
								})}>
							Logg inn
						</ListItem>
					{/if}
				</List>
			</span>
		{/if}
	</Toolbar>
</header>

<style>
	header {
		z-index: 999999;

		border-style: solid;
		border-width: 2px;
		border-left-color: var(--border-lightest);
		border-top-color: var(--border-lightest);
		border-right-color: var(--border-darkest);
		border-bottom-color: var(--border-darkest);
		box-shadow: inset 1px 1px 0px 1px var(--border-light),
			inset -1px -1px 0 1px var(--border-dark);

		box-sizing: border-box;
		display: inline-block;
		background: var(--material);
		color: var(--material-text);

		position: fixed;
		bottom: 0;
		right: 0;
		left: auto;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	span {
		position: absolute;
		left: 0;
		bottom: 100%;
		min-width: 200px;
	}
</style>
