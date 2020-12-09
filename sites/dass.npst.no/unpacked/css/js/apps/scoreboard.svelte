<script lang="ts">
	import * as Sentry from "@sentry/browser";
	import ListItem from "../components/list-item.svelte";
	import List from "../components/list.svelte";
	import ToolbarItem from "../components/toolbar-item.svelte";
	import Toolbar from "../components/toolbar.svelte";
	import Window from "../components/window.svelte";
	import { scoreboard } from "../utils/api";
	import { user, kernelPanic, apps } from "../store";
	import Table from "../components/table.svelte";
	import ListDivider from "../components/list-divider.svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;

	const asm = `
mov ax,504h
mov ebx,13371337h
xor ecx,ecx
dec ecx
mov edx,1
int 31h
	`;

	let fetchPromise = scoreboard();
	let refreshing = false;

	function formatDisplayName(display_name: string) {
		const illegal = ["👉", "👑"];
		let formatted = display_name.substring(0, 20);
		if (display_name.length > 20) formatted += "...";
		return formatted.replace(new RegExp(illegal.join("|"), "g"), "💩");
	}

	async function refresh() {
		if (refreshing) return;
		refreshing = true;
		try {
			let data = await scoreboard();
			fetchPromise = Promise.resolve(data);
		} catch (e) {
			Sentry.captureException(e);
		} finally {
			refreshing = false;
		}
	}

	// Look for new messages every time the app gets focus
	let hasFocus = false;
	$: if (order === $apps.length - 1) {
		if (!hasFocus) {
			hasFocus = true;
			refresh();
		}
	} else {
		hasFocus = false;
	}
</script>

<Window windowTitle="Poengoversikt" {id} {order} width={600} height={500}>
	<div slot="toolbar">
		<Toolbar loading={refreshing}>
			<ToolbarItem name="Fil">
				<List>
					<ListItem size="md" on:mouseup={refresh}>Oppdater</ListItem>
					<ListDivider />
					<ListItem size="md" on:mouseup={() => apps.close(id)}>
						Avslutt Poengoversikt
					</ListItem>
				</List>
			</ToolbarItem>
			<ToolbarItem name="Vis">
				<List>
					<ListItem size="md" on:mouseup={() => kernelPanic.set(asm)}>
						Alle flagg
					</ListItem>
				</List>
			</ToolbarItem>
		</Toolbar>
	</div>
	<div slot="content" class="content">
		{#await fetchPromise}
			<p>Laster data ...</p>
		{:then data}
			<Table>
				<thead>
					<tr>
						<th>Navn</th>
						<th>Poeng</th>
						<th>Marg</th>
					</tr>
				</thead>
				<tbody>
					{#each data?.result || [] as row, index}
						<tr>
							<td>
								{#if $user?.display_name === row.display_name}👉{/if}
								{#if index === 0}👑{/if}
								{formatDisplayName(row.display_name)}
							</td>
							<td>{10 * +row.challenges_solved}</td>
							<td>{+row.eggs_solved > 0 ? `⭐ x ${row.eggs_solved}` : ''}</td>
						</tr>
					{:else}
						<tr />
					{/each}
				</tbody>
			</Table>
		{:catch error}
			<p>Noe gikk galt: {error}</p>
		{/await}
	</div>
</Window>

<style>
	td:not(:first-child) {
		text-align: center;
	}

	.content {
		height: 100%;
		overflow: auto;
	}
</style>
