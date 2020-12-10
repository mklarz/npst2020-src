<script type="ts">import { hex } from "../utils";
import { workspace } from "../store";
export let inputPtr;
export let executing;
export let stdin;
function toBuffer(raw) {
    try {
        let values = (raw.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16));
        return new Uint8Array(values);
    }
    catch (e) {
        return new Uint8Array([]);
    }
}
$: stdin = toBuffer($workspace.input);
</script>

{#if executing}
	<div>
		{#each [...stdin].map((value) => hex(value).slice(-2)) as byte, index}
			<span class:current={index === inputPtr}>{byte}</span>
		{/each}
	</div>
{:else}
	<input
		type="text"
		pattern="^[0-9abcdefABCDEF]+$"
		bind:value={$workspace.input} />
{/if}

<style>
	div {
		min-height: calc(1.15em + 2px);
		overflow: auto;
		white-space: nowrap;
		padding: 1px 2px;
	}

	span {
		display: inline-block;
		height: 100%;
		color: var(--borderColor);
	}
	span.current {
		color: var(--colorPrimary);
	}

	input {
		background-color: black;
		color: var(--colorPrimary);
		border: none;
		outline: none;
		width: 100%;
		height: 100%;
		padding: 1px 2px;
	}

	input:invalid {
		color: var(--errorColor);
	}
</style>
