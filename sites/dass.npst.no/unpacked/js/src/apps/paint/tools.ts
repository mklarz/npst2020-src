import BrushSize from "./settings/brush-size.svelte";
const colorToString = (c) => `rgb(${c.join(",")})`;
const pencilTool = {
    name: "pencil",
    icon: "✏️",
    drawStart(event, ctx, state) {
        ctx.fillStyle = colorToString(state.primaryColor);
        ctx.fillRect(event.detail.currentPos[0], event.detail.currentPos[1], 1, 1);
    },
    drawing(event, ctx, state) {
        ctx.strokeStyle = colorToString(state.primaryColor);
        ctx.fillStyle = colorToString(state.primaryColor);
        ctx.lineWidth = 1;
        ctx.fillRect(event.detail.currentPos[0], event.detail.currentPos[1], 1, 1);
        ctx.beginPath();
        ctx.moveTo(...event.detail.previousPos);
        ctx.lineTo(...event.detail.currentPos);
        ctx.stroke();
        ctx.closePath();
    },
    drawEnd() { },
};
const eraserTool = {
    name: "eraser",
    icon: "🧽",
    settings: BrushSize,
    drawStart(event, ctx, state) {
        ctx.fillStyle = "white";
        ctx.fillRect(event.detail.currentPos[0] - state.brushSize / 2, event.detail.currentPos[1] - state.brushSize / 2, state.brushSize, state.brushSize);
    },
    drawing(event, ctx, state) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = state.brushSize;
        ctx.fillRect(event.detail.currentPos[0] - state.brushSize / 2, event.detail.currentPos[1] - state.brushSize / 2, state.brushSize, state.brushSize);
        ctx.beginPath();
        ctx.moveTo(...event.detail.previousPos);
        ctx.lineTo(...event.detail.currentPos);
        ctx.stroke();
        ctx.closePath();
    },
    drawEnd() { },
};
const paintBrush = {
    name: "paintbrush",
    icon: "🖌",
    settings: BrushSize,
    drawStart(event, ctx, state) {
        ctx.fillStyle = colorToString(state.primaryColor);
        ctx.fillRect(event.detail.currentPos[0] - state.brushSize / 2, event.detail.currentPos[1] - state.brushSize / 2, state.brushSize, state.brushSize);
    },
    drawing(event, ctx, state) {
        ctx.strokeStyle = colorToString(state.primaryColor);
        ctx.fillStyle = colorToString(state.primaryColor);
        ctx.lineWidth = state.brushSize;
        ctx.fillRect(event.detail.currentPos[0] - state.brushSize / 2, event.detail.currentPos[1] - state.brushSize / 2, state.brushSize, state.brushSize);
        ctx.beginPath();
        ctx.moveTo(...event.detail.previousPos);
        ctx.lineTo(...event.detail.currentPos);
        ctx.stroke();
        ctx.closePath();
    },
    drawEnd() { },
};
const paintBucket = {
    name: "paintbucket",
    icon: "🌊",
    drawStart(event, ctx, state) {
        const [canvasWidth, canvasHeight] = state.canvasSize;
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const getPos = (x, y) => (y * canvasWidth + x) * 4;
        const getColor = (pos) => [
            imageData.data[pos],
            imageData.data[pos + 1],
            imageData.data[pos + 2],
        ];
        const [startX, startY] = event.detail.currentPos;
        const startPos = getPos(startX, startY);
        const [startR, startG, startB] = getColor(startPos);
        const [fillR, fillG, fillB] = state.primaryColor;
        const colorPixel = (pos) => {
            imageData.data[pos] = fillR;
            imageData.data[pos + 1] = fillG;
            imageData.data[pos + 2] = fillB;
            imageData.data[pos + 3] = 255;
        };
        const matchStartColor = (pos) => {
            const [r, g, b] = getColor(pos);
            return r === startR && g === startG && b === startB;
        };
        const stack = [event.detail.currentPos];
        if (startR === fillR && startG === fillG && startB === fillB) {
            return;
        }
        while (stack.length) {
            const currentPos = stack.pop();
            if (!currentPos)
                break; // Should never happen
            let [x, y] = currentPos;
            let pixelPos = getPos(x, y);
            do {
                pixelPos -= canvasWidth * 4;
            } while (--y >= 0 && matchStartColor(pixelPos));
            pixelPos += canvasWidth * 4;
            y += 1;
            let reachLeft = false;
            let reachRight = false;
            while (y < canvasHeight - 1 && matchStartColor(pixelPos)) {
                colorPixel(pixelPos);
                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            stack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    }
                    else {
                        reachLeft = false;
                    }
                }
                if (x < canvasWidth - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            stack.push([x + 1, y]);
                            reachRight = true;
                        }
                    }
                    else {
                        reachRight = false;
                    }
                }
                y += 1;
                pixelPos += canvasWidth * 4;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    },
    drawing() { },
    drawEnd() { },
};
export default [pencilTool, paintBrush, eraserTool, paintBucket];
