<script type="ts">;
import { compressToEncodedURIComponent } from "lz-string";
import { onDestroy } from "svelte";
import { workspace } from "../store";
export let currentLine;
export let executing;
let timeout = undefined;
function doExpensiveCompute() {
    window.location.hash = compressToEncodedURIComponent(JSON.stringify($workspace));
}
function handleChange() {
    clearTimeout(timeout);
    timeout = setTimeout(doExpensiveCompute, 500);
}
onDestroy(() => clearTimeout(timeout));
</script>

{#if executing}
	<div class="wrapper">
		{#each $workspace.sourceCode.split('\n') as line, lineNumber}
			<div class="line" class:current={lineNumber === currentLine?.lineNumber}>
				<span class="code">{line}&nbsp;</span>
				{#if currentLine?.lineNumber === lineNumber && currentLine?.address !== null}
					<span
						class="symbol">{`@ 0x${currentLine.address
							.toString(16)
							.padStart(2, '0')}`}</span>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<textarea
		spellcheck={false}
		bind:value={$workspace.sourceCode}
		on:input={handleChange} />
{/if}

<style>
	textarea {
		height: 100%;
		white-space: pre;
	}

	div.wrapper {
		padding: 0.4em;
		margin: 0 0 0.5em 0;
		overflow: auto;
		border-radius: 2px;
		height: 100%;
		width: 100%;
		color: rgba(255, 255, 255, 0.4);
	}

	div.line {
		display: block;
		position: relative;
		width: 100%;
		height: auto;
	}

	span.code {
		font-size: 16px;
		white-space: pre;
	}

	span.symbol {
		display: block;
		text-align: right;
		position: absolute;
		right: 0;
		top: 0;
	}
	div.line.current {
		background: rgba(255, 255, 255, 0.4);
		color: lightgreen;
	}
</style>
