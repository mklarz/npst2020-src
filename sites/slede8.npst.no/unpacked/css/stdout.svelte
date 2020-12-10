<script type="ts">import { hex } from "../utils";
;
import Button from "./button.svelte";
export let runtime;
$: buff = (runtime === null || runtime === void 0 ? void 0 : runtime.stdout) || new Uint8Array();
$: utf8 = new TextDecoder("utf-8").decode(buff);
let ascii = false;
$: content = ascii ? utf8 : [...buff].map((x) => hex(x).slice(-2)).join("");
</script>

<div>
	<Button gray={!ascii} on:click={() => (ascii = true)}>Aa</Button>
	<Button gray={ascii} on:click={() => (ascii = false)}>0x</Button>
</div>
<textarea readonly>{content}</textarea>

<style>
	div {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
	}
	textarea {
		height: 100%;
		white-space: pre;
	}
</style>
