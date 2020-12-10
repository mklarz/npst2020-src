<script type="ts">import { onDestroy } from "svelte";
import Box from "./box.svelte";
import Button from "./button.svelte";
import Popup from "./popup.svelte";
import DownloadButton from "./download-button.svelte";
import Icon from "fa-svelte";
;
import { compressToEncodedURIComponent } from "lz-string";
import { workspace } from "../store";
import { assemble } from "@pstnorge/slede8";
import { faDownload, faHammer } from "@fortawesome/free-solid-svg-icons";
export let hide;
let shareableURL;
const getURL = (workspace) => {
    const workspaceState = compressToEncodedURIComponent(JSON.stringify(workspace));
    return `${window.location.origin}#${workspaceState}`;
};
$: shareableURL = getURL($workspace);
let downloadURL;
let compileError = null;
function compile() {
    try {
        compileError = null;
        const target = assemble($workspace.sourceCode);
        URL.revokeObjectURL(downloadURL);
        const blob = new Blob([target.exe.buffer], {
            type: "application/octet-stream",
        });
        downloadURL = URL.createObjectURL(blob);
    }
    catch (e) {
        compileError = `Feil under montering: \n${e}`;
    }
}
onDestroy(() => {
    URL.revokeObjectURL(downloadURL);
});
</script>

<Popup {hide}>
	<Box>
		<section>
			<h1>Del</h1>

			<p>Benytt lenken nedenfor til å dele mesterverket ditt.</p>
			<input
				id="share-workspace-url"
				type="text"
				readonly
				bind:value={shareableURL} />
			<p><strong>OBS</strong>: Må ikke deles med SPST.</p>
			<h2>Eksporter binærfil</h2>

			{#if downloadURL}
				<DownloadButton fullWidth href={downloadURL} download="program.s8">
					<Icon icon={faDownload} />
					Last ned
				</DownloadButton>
			{:else if compileError}
				<p class="error">{compileError}</p>
			{:else}
				<Button fullWidth on:click={compile}>
					<Icon icon={faHammer} />
					Monter
				</Button>
			{/if}

			<p>
				<Button fullWidth on:click={hide}>Lukk</Button>
			</p>
		</section>
	</Box>
</Popup>

<style>
	section {
		padding: 1em;
	}
	h1 {
		margin: 0 0 0.2em 0;
		padding: 0;
	}
	input {
		width: 100%;
		display: block;
		background: var(--backgroundColor);
		color: var(--primaryColor);
		border: none;
		outline: none;
		border: 1px solid var(--primaryColor);
		padding: 0.2em 0.5em;
	}

	p.error {
		color: var(--errorColor);
	}
</style>
