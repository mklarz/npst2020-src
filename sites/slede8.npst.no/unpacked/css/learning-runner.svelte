<script type="ts">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Button from "./button.svelte";
import { eLearning, workspace } from "../store";
import { step, assemble } from "@pstnorge/slede8";
import { hex } from "../utils";
;
function tryAssemble() {
    try {
        const { exe } = assemble($workspace.sourceCode);
        return exe;
    }
    catch (e) {
        throw `Feil under montering: \n${e}`;
    }
}
function abort() {
    eLearning.set(null);
}
let clientSideTests = null;
let serverSideTests = null;
function runClientSideTests() {
    return __awaiter(this, void 0, void 0, function* () {
        serverSideTests = null;
        clientSideTests = new Promise((resolve) => {
            const exe = tryAssemble();
            let stdin = new Uint8Array(($eLearning === null || $eLearning === void 0 ? void 0 : $eLearning.exampleInput) || []);
            let session = step(exe, stdin, 10000);
            while (true) {
                const tick = session.next();
                if (tick.done) {
                    const expected = [...(($eLearning === null || $eLearning === void 0 ? void 0 : $eLearning.exampleOutput) || [])]
                        .map((x) => hex(x))
                        .toString();
                    const actual = [...tick.value.stdout].map((x) => hex(x)).toString();
                    const input = [...stdin].map((x) => hex(x).slice(-2)).join("");
                    if (expected !== actual) {
                        return resolve({
                            message: `Feil resultat med input '${input}'\nForventet '${expected}'\nFikk '${actual}'`,
                            success: false,
                        });
                    }
                    serverSideTests = runServerSideTests(exe);
                    return resolve({
                        message: "Koden besto eksempeltesten",
                        success: true,
                    });
                }
            }
        });
    });
}
function runServerSideTests(exe) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch("/.netlify/functions/run", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: $eLearning === null || $eLearning === void 0 ? void 0 : $eLearning.id, blob: [...exe] }),
        }).then((res) => __awaiter(this, void 0, void 0, function* () { return (yield res.json()); }));
    });
}
</script>

<p>Lever besvarelse</p>
<p>
	<Button fullWidth on:click={runClientSideTests}>Send inn</Button>
</p>
<p>
	<Button error fullWidth on:click={abort}>Avbryt modul</Button>
</p>

{#await clientSideTests}
	<p>⏳ Kjører lokale tester</p>
{:then localResult}
	{#if localResult?.success === true}
		<p>✔ Lokale tester bestått</p>
		{#await serverSideTests}
			<p>⏳ Kjører tester på server</p>
		{:then serverResult}
			{#if serverResult?.success === true}
				<p>✔ Tester på server bestått</p>
				<textarea>{serverResult?.message}</textarea>
			{:else if serverResult?.success === false}
				<p>❌ Tester på server feilet</p>
				<textarea readonly class="error">{serverResult?.message}</textarea>
			{/if}
		{:catch}
			<p>❌ Tester på server kræsjet</p>
		{/await}
	{:else if localResult?.success === false}
		<p>❌ Lokale tester feilet</p>
		<textarea readonly class="error">{localResult?.message}</textarea>
	{/if}
{:catch localError}
	<p>❌ Lokale tester kræsjet</p>
	<textarea readonly class="error">{localError}</textarea>
{/await}

<style>
	textarea {
		color: var(--primaryColor);
		background: var(--backgroundColor);
		border-color: var(--primaryColor);
		width: 100%;
		resize: none;
		height: 5em;
	}

	textarea.error {
		color: var(--errorColor);
		border-color: var(--errorColor);
	}
</style>
