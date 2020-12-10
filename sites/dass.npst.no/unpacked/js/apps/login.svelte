<script lang="ts">
	import { login } from "../utils/authentication";
	import Button from "../components/button.svelte";
	import Window from "../components/window.svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;
</script>

<Window windowTitle="Logg inn" {id} {order}>
	<div slot="content">
		<p>DASS er en tjeneste tilbudt av Winther Consulting™</p>
		<br />
		<p>For å benytte tjenesten må du logge inn.</p>
		<br />
		<Button primary fullWidth on:click={login}>Logg inn</Button>
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
