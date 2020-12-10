<script lang="ts">import Window from "../components/window.svelte";
import { clock } from "../store";
import Cutout from "../components/cutout.svelte";
import Button from "../components/button.svelte";
/** Internal window props */
export let id;
export let order;
function datefmt(date) {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    return date.toLocaleString("no", options);
}
let timeOffset = +(localStorage.getItem("clockOffset") || 0) || 0;
$: clientTime = new Date($clock.system.getTime() + 1000 * timeOffset);
</script>

<Window
	windowTitle={`⚙️ Systeminnstillinger`}
	{id}
	{order}
	width={600}
	height={350}>
	<div slot="content" class="container">
		<fieldset>
			<legend>Systemklokke</legend>
			<div>
				<p>Rapportert tid: {datefmt($clock.system)}</p>
			</div>
			<div>
				<label for="klokke">Kompenserende tiltak</label>
				<Cutout scrollable={false}>
					<input type="number" bind:value={timeOffset} name="klokke" />
				</Cutout>
			</div>

			<div>
				<p>Kompensert tid: {datefmt(clientTime)}</p>
				<Button
					fullWidth
					on:click={() => localStorage.setItem('clockOffset', `${timeOffset}`)}>
					Lagre endringer
				</Button>
			</div>
		</fieldset>
	</div>
</Window>

<style>
	/* fieldset {
	} */

	fieldset > div {
		margin-bottom: 0.5em;
	}
	input {
		width: 100%;
		display: inline-block;
		border: none;
		outline: none;
		line-height: 1.5;
		padding: 0 0.2em;
	}
</style>
