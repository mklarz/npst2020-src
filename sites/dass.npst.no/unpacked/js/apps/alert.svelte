<script lang="ts">
	import { onDestroy } from "svelte";

	import Window from "../components/window.svelte";

	import Button from "../components/button.svelte";
	import { apps } from "../store";

	/** Internal window props */
	export let id: string;
	export let order: number;

	export let title: string;
	export let message: string;
	export let severity: "success" | "info" | "warning" | "error" = "info";

	export let closeCallback: () => void = () => undefined;

	onDestroy(closeCallback);
</script>

<Window windowTitle={title} {id} {order} width={550} height={250}>
	<div slot="content" class="content">
		<div class="main">
			<span>{severity === 'success' ? '✅' : severity === 'info' ? 'ℹ' : severity === 'warning' ? '⚠️' : '⛔'}</span>
			<p>{message}</p>
		</div>
		<div class="footer">
			<Button fullWidth on:click={() => apps.close(id)}>OK</Button>
		</div>
	</div>
</Window>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	.main {
		flex: 1;
		display: flex;
		width: 100%;
	}

	.main > span {
		font-size: 3rem;
		margin-right: 2rem;
	}

	.footer {
		width: 100px;
	}
</style>
