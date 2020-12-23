<script lang="ts">import Window from "../components/window.svelte";
import Cutout from "../components/cutout.svelte";
/** Internal window props */
export let id;
export let order;
export let title;
export let content;
</script>

<Window windowTitle="Dokument - {title}" {id} {order} width={550} height={600}>
	<div slot="content" class="content">
		<Cutout>
			<pre>
				{content}
			</pre>
		</Cutout>
	</div>
</Window>

<style>
	div {
		height: 100%;
		background-color: var(--canvas);
	}

	pre {
		margin: 1em 2em;
		user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		-webkit-user-select: text;
	}
</style>
