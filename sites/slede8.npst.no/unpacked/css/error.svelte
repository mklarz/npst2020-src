<script type="ts">import Box from "./box.svelte";
import Button from "./button.svelte";
import Popup from "./popup.svelte";
export let hide;
export let message;
</script>

<Popup {hide}>
	<Box error>
		<section>
			<h1>Noe gikk galt</h1>
			<pre>{message}</pre>
			<p>
				<Button error fullWidth on:click={hide}>Lukk</Button>
			</p>
		</section>
	</Box>
</Popup>

<style>
	section {
		color: var(--errorColor);
		padding: 1em;
	}
	h1 {
		margin: 0;
		padding: 0;
	}
	pre {
		color: var(--errorColor);
	}
</style>
