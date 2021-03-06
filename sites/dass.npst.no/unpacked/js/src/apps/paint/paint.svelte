<script lang="ts">
	import ListDivider from "../../components/list-divider.svelte";
	import ListItem from "../../components/list-item.svelte";
	import List from "../../components/list.svelte";
	import ToolbarItem from "../../components/toolbar-item.svelte";
	import Toolbar from "../../components/toolbar.svelte";
	import Window from "../../components/window.svelte";
	import type { DrawEvent } from "../../utils/drawable";
	import ArtBoard from "./art-board.svelte";
	import PaintTools from "./paint-tools.svelte";
	import ColorPicker from "./color-picker.svelte";
	import state from "./store";
	import tools from "./tools";
	import { background, kernelPanic } from "../../store";
	import { onMount } from "svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;

	const asm = `
inc ebp
inc edi
inc edi
jnp $+0x7a
cmp [esi],dh
pop edi
insd
popad
arpl [eax+0x69],bp
outsb
inc ebp
pop edi
arpl [edi+0x64],bp
inc ebp
jb $+0x7f
	`;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null = null;

	function clear() {
		if (context) {
			context.fillStyle = "white";
			context.fillRect(0, 0, ...$state.canvasSize);
		}
	}

	function download() {
		const dataUrl = canvas
			.toDataURL("image/png")
			.replace(/^data:image\/[^;]*/, "data:application/octet-stream");

		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "kunstverk.png";
		link.target = "_blank";
		link.click();
	}

	function setBackground() {
		background.set(canvas.toDataURL("image/png"));
	}

	function handleDrawStart(event: DrawEvent) {
		if (!context) return;
		tools
			.find((t) => t.name === $state.currentTool)
			?.drawStart(event, context, $state);
	}

	function handleDrawing(event: DrawEvent) {
		if (!context) return;
		tools
			.find((t) => t.name === $state.currentTool)
			?.drawing(event, context, $state);
	}

	function handleDrawEnd(event: DrawEvent) {
		if (!context) return;
		tools
			.find((t) => t.name === $state.currentTool)
			?.drawEnd(event, context, $state);
	}
</script>

<Window windowTitle="🎨 Mal" {id} {order} width={600} height={520}>
	<div slot="toolbar">
		<Toolbar>
			<ToolbarItem name="Fil">
				<List>
					<ListItem size="md" on:mouseup={download}>Last ned</ListItem>
					<ListItem size="md" on:mouseup={setBackground}>
						Sett som skrivebordsbakgrunn
					</ListItem>
					<ListDivider />
					<ListItem size="md">Avslutt mal.exe</ListItem>
				</List>
			</ToolbarItem>
			<ToolbarItem name="Lerret">
				<List>
					<ListItem size="md" on:mouseup={clear}>Rensk</ListItem>
				</List>
			</ToolbarItem>
			<ToolbarItem name="Hjelp">
				<List>
					<ListItem
						size="md"
						on:mouseup={() => window.open('https://www.youtube.com/watch?v=lLWEXRAnQd0&list=PLAEQD0ULngi67rwmhrkNjMZKvyCReqDV4', '_blank')}>
						Jeg trenger hjelp
					</ListItem>
					<ListItem size="md" on:mouseup={() => kernelPanic.set(asm)}>
						Åpne Mal 3D (x86)
					</ListItem>
				</List>
			</ToolbarItem>
		</Toolbar>
	</div>
	<div slot="content" class="content">
		<aside class="tools">
			<PaintTools />
		</aside>
		<article>
			<ArtBoard
				bind:canvas
				bind:context
				on:drawStart={handleDrawStart}
				on:draw={handleDrawing}
				on:drawEnd={handleDrawEnd} />
		</article>
		<aside class="colors">
			<ColorPicker />
		</aside>
	</div>
</Window>

<style>
	.content {
		width: 100%;
		height: 100%;
		display: grid;
		gap: 10px;
		grid-template-columns: 90px 1fr;
		grid-template-rows: 1fr auto;
		grid-template-areas:
			"tools canvas"
			"colors colors";
	}

	.tools {
		display: flex;
		flex-direction: column;
	}

	.colors {
		grid-area: colors;
	}

	article {
		overflow: hidden;
		grid-area: canvas;
	}
</style>
