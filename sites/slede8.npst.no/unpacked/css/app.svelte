<script lang="ts">import { assemble, step } from "@pstnorge/slede8";
;
;
import { decompressFromEncodedURIComponent } from "lz-string";
import { onMount } from "svelte";
import Box from "./components/box.svelte";
import Button from "./components/button.svelte";
import Error from "./components/error.svelte";
import Export from "./components/export.svelte";
import Learning from "./components/learning.svelte";
import Registers from "./components/registers.svelte";
import SourceCode from "./components/source-code.svelte";
import Stdin from "./components/stdin.svelte";
import Stdout from "./components/stdout.svelte";
;
import { workspace } from "./store";
const CPU_CYCLE_LIMIT = 1000;
const WALK_CPU_CYCLE_DURATION = 100;
const RUN_CPU_CYCLE_DURATION = 0;
const DEFAULT_RUNTIME = {
    pc: 0,
    regs: new Uint8Array(16),
    memory: new Uint8Array(4096),
    flag: false,
    stdout: new Uint8Array(),
    inputPtr: 0,
};
let activePopup = null;
let target = null;
let session = null;
let errorMessage = "";
let programIsRunning;
let executeNextInstructionWhenDone = false;
let lastCycle = 0;
let cycleDuration = WALK_CPU_CYCLE_DURATION;
let cpuCycleLimit = () => {
    let temp = +(localStorage.getItem("🚲") || "");
    if (!isNaN(temp) && temp > 0) {
        return ~~temp;
    }
    return CPU_CYCLE_LIMIT;
};
$: runtime = DEFAULT_RUNTIME;
$: stdin = new Uint8Array();
$: target;
$: session;
$: programIsRunning = session !== null;
onMount(() => {
    const fragment = window.location.hash.substring(1);
    if (fragment.length > 0) {
        try {
            const shared = JSON.parse(decompressFromEncodedURIComponent(fragment));
            workspace.set(shared);
        }
        catch (_a) {
            console.info("Unable to restore workspace");
        }
    }
});
function displayError(message) {
    errorMessage = message;
    activePopup = "error";
}
function spawn() {
    runtime = Object.assign({}, DEFAULT_RUNTIME);
    try {
        target = assemble($workspace.sourceCode);
        session = step(target.exe, stdin, cpuCycleLimit());
    }
    catch (e) {
        displayError(`Montering feilet\n\n${e}`);
        reset();
    }
}
function runSingleStep() {
    var _a, _b;
    const now = new Date().getTime();
    if (now - lastCycle < cycleDuration)
        return requestAnimationFrame(runSingleStep);
    lastCycle = now;
    if (!session)
        spawn();
    try {
        let tick = session === null || session === void 0 ? void 0 : session.next();
        const rawLine = ((_b = target === null || target === void 0 ? void 0 : target.pdb[((_a = tick === null || tick === void 0 ? void 0 : tick.value) === null || _a === void 0 ? void 0 : _a.pc) || 0]) === null || _b === void 0 ? void 0 : _b.raw) || "";
        if (rawLine.includes(";!")) {
            // breakpoint
            executeNextInstructionWhenDone = false;
        }
        if (tick === null || tick === void 0 ? void 0 : tick.done)
            return complete();
        runtime = Object.assign(Object.assign({}, runtime), tick === null || tick === void 0 ? void 0 : tick.value);
    }
    catch (e) {
        displayError(`Kjøring feilet\n\n${e}`);
        return stop();
    }
    if (executeNextInstructionWhenDone) {
        requestAnimationFrame(runSingleStep);
    }
}
function sprintToCompletion() {
    var _a, _b;
    if (!session)
        spawn();
    while (session) {
        try {
            const tick = session === null || session === void 0 ? void 0 : session.next();
            const rawLine = ((_b = target === null || target === void 0 ? void 0 : target.pdb[((_a = tick === null || tick === void 0 ? void 0 : tick.value) === null || _a === void 0 ? void 0 : _a.pc) || 0]) === null || _b === void 0 ? void 0 : _b.raw) || "";
            if (tick === null || tick === void 0 ? void 0 : tick.done)
                complete();
            if (rawLine.includes(";!") || (tick === null || tick === void 0 ? void 0 : tick.done)) {
                // breakpoint
                runtime = Object.assign(Object.assign({}, runtime), tick === null || tick === void 0 ? void 0 : tick.value);
                break;
            }
        }
        catch (e) {
            displayError(`Kjøring feilet\n\n${e}`);
            return stop();
        }
    }
}
function runToCompletion() {
    cycleDuration = RUN_CPU_CYCLE_DURATION;
    executeNextInstructionWhenDone = true;
    requestAnimationFrame(runSingleStep);
}
function walkToCompletion() {
    cycleDuration = WALK_CPU_CYCLE_DURATION;
    executeNextInstructionWhenDone = true;
    requestAnimationFrame(runSingleStep);
}
function stop() {
    executeNextInstructionWhenDone = false;
}
function complete() {
    stop();
    session = null;
}
function reset() {
    stop();
    session = null;
    target = null;
    runtime = DEFAULT_RUNTIME;
}
function pause() {
    executeNextInstructionWhenDone = false;
}
</script>

{#if activePopup === 'eLearning'}
	<Learning
		hide={() => {
			activePopup = null;
		}} />
{:else if activePopup === 'export'}
	<Export
		hide={() => {
			activePopup = null;
		}} />
{:else if activePopup === 'error'}
	<Error
		hide={() => {
			activePopup = null;
		}}
		message={errorMessage} />
{/if}

<main>
	<div id="stdin">
		<Box label="Føde">
			<Stdin
				bind:stdin
				executing={programIsRunning}
				inputPtr={runtime.inputPtr} />
		</Box>
	</div>

	<div id="source">
		<Box label="Kode">
			<SourceCode
				currentLine={target?.pdb[runtime.pc] || null}
				executing={programIsRunning} />
		</Box>
	</div>

	<div id="controls">
		<Box label="Kontroller">
			<nav>
				<Button
					disabled={executeNextInstructionWhenDone}
					fullWidth
					fullHeight
					on:click={runSingleStep}>
					Skritt
				</Button>
				{#if executeNextInstructionWhenDone}
					<Button
						disabled={!executeNextInstructionWhenDone}
						fullWidth
						fullHeight
						on:click={pause}>
						Pause
					</Button>
				{:else}
					<div style="display: flex">
						<Button
							disabled={executeNextInstructionWhenDone}
							fullWidth
							fullHeight
							on:click={walkToCompletion}>
							Gå
						</Button>
						<Button
							disabled={executeNextInstructionWhenDone}
							fullWidth
							fullHeight
							on:click={runToCompletion}>
							Jogg
						</Button>
						<Button
							disabled={executeNextInstructionWhenDone}
							fullWidth
							fullHeight
							on:click={sprintToCompletion}>
							Løp
						</Button>
					</div>
				{/if}
				<Button
					disabled={!programIsRunning}
					fullWidth
					fullHeight
					on:click={reset}>
					Stans
				</Button>
				<Button
					disabled={programIsRunning}
					fullWidth
					fullHeight
					on:click={() => (activePopup = 'eLearning')}>
					E-læring
				</Button>
				<Button
					disabled={programIsRunning}
					fullWidth
					fullHeight
					on:click={() => (activePopup = 'export')}>
					Del
				</Button>
			</nav>
		</Box>
	</div>

	<div id="state">
		<Box label="Tilstand">
			<Registers {runtime} />
		</Box>
	</div>

	<div id="stdout">
		<Box label="Oppgulp">
			<Stdout {runtime} />
		</Box>
	</div>
</main>

<style>
	main :global(textarea) {
		padding: 0.2em 0.5em;
		width: 100%;
		resize: none;
		overflow: auto;

		color: var(--primaryColor);
		background-color: var(--backgroundColor);
		border: none;
		outline: none;
	}

	main {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		display: grid;
		grid-template-areas:
			"stdin stdin stdin"
			"source controls state"
			"source stdout stdout";
		grid-template-rows: auto 1fr 1fr;
		grid-template-columns: 2fr 1fr auto;
	}

	main > div {
		width: 100%;
		height: 100%;
		padding: 1em 0.5em;
	}

	#stdin {
		grid-area: stdin;
	}
	#stdout {
		grid-area: stdout;
	}
	#source {
		grid-area: source;
	}
	#state {
		grid-area: state;
	}
	#controls {
		grid-area: controls;
	}

	nav {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 1em;
		padding: 1em;
		height: 100%;
	}
</style>
