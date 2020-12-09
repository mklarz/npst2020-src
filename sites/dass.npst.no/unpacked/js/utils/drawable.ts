export default function drawable(node) {
    let currentPos = [0, 0];
    let previousPos = [0, 0];
    function handleMousedown(event) {
        currentPos = [event.offsetX, event.offsetY];
        previousPos = currentPos;
        node.dispatchEvent(new CustomEvent("drawStart", {
            detail: { currentPos, previousPos },
        }));
        window.addEventListener("mousemove", handleMousemove);
        window.addEventListener("mouseup", handleMouseup);
        node.addEventListener("mouseleave", mouseLeave);
    }
    function handleMousemove(event) {
        previousPos = currentPos;
        currentPos = [event.offsetX, event.offsetY];
        node.dispatchEvent(new CustomEvent("draw", {
            detail: { currentPos, previousPos },
        }));
    }
    function handleMouseup() {
        window.removeEventListener("mousemove", handleMousemove);
        window.removeEventListener("mouseup", handleMouseup);
        node.removeEventListener("mouseenter", mouseEnter);
        node.removeEventListener("mouseleave", mouseLeave);
        node.dispatchEvent(new CustomEvent("drawEnd", {
            detail: { currentPos, previousPos },
        }));
    }
    function mouseLeave() {
        window.removeEventListener("mousemove", handleMousemove);
        node.removeEventListener("mouseleave", mouseLeave);
        node.addEventListener("mouseenter", mouseEnter);
    }
    function mouseEnter(event) {
        currentPos = [event.offsetX, event.offsetY];
        previousPos = currentPos;
        node.removeEventListener("mouseenter", mouseEnter);
        window.addEventListener("mousemove", handleMousemove);
        node.addEventListener("mouseleave", mouseLeave);
    }
    node.addEventListener("mousedown", handleMousedown);
    return {
        destroy() {
            node.removeEventListener("mousedown", handleMousedown);
        },
    };
}
