<script type="ts">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Box from "./box.svelte";
import Button from "./button.svelte";
import LearningRunner from "./learning-runner.svelte";
import Popup from "./popup.svelte";
import { eLearning, workspace } from "../store";
import { hex } from "../utils";
export let hide;
let loadPromise = null;
let writeModuleId = "";
let selectModuleId = ($eLearning === null || $eLearning === void 0 ? void 0 : $eLearning.id) || "Hei, verden!";
let defaultModules = [
    { label: "Hei, verden!", id: "Hei, verden!" },
    { label: "Enkel addisjon", id: "Enkel addisjon" },
    { label: "Skriv inn kode manuelt", id: null },
];
$: moduleId = selectModuleId || writeModuleId;
function load() {
    loadPromise = fetch(`/.netlify/functions/load?id=${encodeURIComponent(moduleId)}`).then((res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield res.json();
        if ("error" in data)
            throw data.error;
        const { id, exampleInput, exampleOutput, sourceCode, } = data;
        workspace.set({
            sourceCode,
            input: exampleInput.map((x) => hex(x).slice(-2)).join(""),
        });
        eLearning.set({ id, exampleInput, exampleOutput, sourceCode });
    }));
}
</script>

<Popup {hide}>
	<Box>
		<section>
			<h1>E-læring</h1>

			<!-- svelte-ignore empty-block -->
			{#await loadPromise}{:catch e}
				<p class="error">Klarte ikke å hente modul: {e}</p>
			{/await}

			{#if $eLearning}
				<div class="module">
					<Box label={$eLearning?.id}>
						<LearningRunner />
					</Box>
				</div>
			{:else}
				<Box label="Velg modul">
					<section>
						<form on:submit|preventDefault={load}>
							<div class="form-control">
								<label for="select">Modul:</label>
								<select id="select" bind:value={selectModuleId}>
									{#each defaultModules as m}
										<option value={m.id}>{m.label}</option>
									{/each}
								</select>
							</div>
							<div class="form-control">
								{#if selectModuleId === null}
									<label for="write">Kode:&nbsp;</label>
									<input id="write" type="text" bind:value={writeModuleId} />
								{/if}
							</div>
							{#await loadPromise}
								<Button fullWidth disabled on:click={load}>Hent</Button>
							{:then}
								<Button fullWidth on:click={load}>Hent</Button>
							{:catch}
								<Button fullWidth on:click={load}>Prøv igjen</Button>
							{/await}
						</form>
					</section>
				</Box>
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
		margin: 0 0 1em 0;
		padding: 0;
	}

	.module {
		margin-top: 2em;
	}

	p.error {
		color: var(--errorColor);
	}

	div.form-control {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 0.5em;
	}

	label {
		display: block;
		padding-right: 1em;
	}

	input {
		flex: 1;
		display: block;
		background: var(--backgroundColor);
		color: var(--primaryColor);
		border: none;
		outline: none;
		border: 1px solid var(--primaryColor);
		padding: 0.2em 0.5em;
	}

	select {
		background: var(--backgroundColor);
		color: var(--primaryColor);
		border-color: var(--primaryColor);
		padding: 0.2em 0.5em;
	}
</style>
