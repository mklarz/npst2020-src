<script lang="ts">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { onMount, tick } from "svelte";
import Cutout from "../../components/cutout.svelte";
import drawable from "../../utils/drawable";
;
import movable from "../../utils/movable";
import state from "./store";
export let canvas;
export let context = null;
let resizeSize = $state.canvasSize;
let isResizing = false;
$: dynamicStyle = `
		--canvasWidht: ${$state.canvasSize[0]}px;
		--canvasHeight: ${$state.canvasSize[1]}px;
		--resizeWidht: ${resizeSize[0]}px;
		--resizeHeight: ${resizeSize[1]}px;
	`;
function handleResize(event, direction) {
    resizeSize = [
        resizeSize[0] + (direction === "vertical" ? 0 : event.detail.dx),
        resizeSize[1] + (direction === "horizontal" ? 0 : event.detail.dy),
    ];
}
function handleResizeEnd() {
    return __awaiter(this, void 0, void 0, function* () {
        isResizing = false;
        const data = canvas === null || canvas === void 0 ? void 0 : canvas.toDataURL();
        $state.canvasSize = resizeSize;
        yield tick();
        if (context) {
            context.fillStyle = "white";
            context.fillRect(0, 0, ...$state.canvasSize);
        }
        if (data) {
            const tmpImg = new Image();
            tmpImg.onload = () => context === null || context === void 0 ? void 0 : context.drawImage(tmpImg, 0, 0);
            tmpImg.src = data;
        }
    });
}
function handleResizeStart() {
    isResizing = true;
}
onMount(() => {
    context = canvas.getContext("2d");
    if (context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, $state.canvasSize[0], $state.canvasSize[1]);
    }
});
</script>

<Cutout>
	<div class="wrapper" style={dynamicStyle}>
		<canvas
			width={$state.canvasSize[0]}
			height={$state.canvasSize[1]}
			bind:this={canvas}
			use:drawable
			on:draw
			on:drawStart
			on:drawEnd />
		<div class="resize-box" class:isResizing />
		<span
			use:movable
			on:move={(e) => handleResize(e, 'horizontal')}
			on:moveStart={handleResizeStart}
			on:moveEnd={handleResizeEnd}
			class="resize-dot resize-dot-right" />
		<span
			use:movable
			on:move={(e) => handleResize(e, 'both')}
			on:moveStart={handleResizeStart}
			on:moveEnd={handleResizeEnd}
			class="resize-dot resize-dot-corner" />
		<span
			use:movable
			on:move={(e) => handleResize(e, 'vertical')}
			on:moveStart={handleResizeStart}
			on:moveEnd={handleResizeEnd}
			class="resize-dot resize-dot-bottom" />
	</div>
</Cutout>

<style>
	.wrapper {
		position: relative;
		height: 100%;
		width: 100%;
		display: inline-table;
		background: var(--material-dark);
		cursor: crosshair;
	}

	canvas {
		margin: 4px 8px 2px 4px;
		background-color: white;
	}

	.resize-box {
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(var(--resizeWidht) + 2px);
		height: calc(var(--resizeHeight) + 2px);
		padding: 0 1px 1px 0;
		border: 1px dashed black;
		visibility: hidden;
	}

	.resize-box.isResizing {
		visibility: visible;
	}

	.resize-dot {
		display: inline-block;
		position: absolute;
		width: 4px;
		height: 4px;
		background: var(--material-text);
	}

	.resize-dot-corner {
		top: calc(var(--canvasHeight) + 4px);
		left: calc(var(--canvasWidht) + 4px);
		cursor: nwse-resize;
	}

	.resize-dot-right {
		top: calc(var(--canvasHeight) / 2 + 4px);
		left: calc(var(--canvasWidht) + 4px);
		cursor: ew-resize;
	}

	.resize-dot-bottom {
		top: calc(var(--canvasHeight) + 4px);
		left: calc(var(--canvasWidht) / 2 + 4px);
		cursor: ns-resize;
	}
</style>
