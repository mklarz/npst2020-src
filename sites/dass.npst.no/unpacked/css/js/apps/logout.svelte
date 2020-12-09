<script lang="ts">
	import { logout } from "../utils/authentication";
	import Button from "../components/button.svelte";
	import Window from "../components/window.svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;
</script>

<Window windowTitle="Logg ut" {id} {order} width={550} height={250}>
	<div slot="content">
		<p>Er du sikker på at du vil logge ut?</p>
		<br />
		<Button primary fullWidth on:click={logout}>
			Ja, jeg er sikker, logg meg ut!
		</Button>
	</div>
</Window>

<style>
	p:first-of-type {
		margin-top: 0;
	}

	p {
		text-align: center;
	}
</style>
