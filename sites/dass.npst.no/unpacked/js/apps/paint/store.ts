import { writable } from "svelte/store";
import colors from "./colors";
export default writable({
    canvasSize: [250, 200],
    primaryColor: colors[0],
    secondaryColor: colors[1],
    currentTool: "pencil",
    brushSize: 2,
});
