export default function movable(node) {
    let x;
    let y;
    function handleMousedown(event) {
        x = event.clientX;
        y = event.clientY;
        node.dispatchEvent(new CustomEvent("moveStart", {
            detail: { x, y, dx: 0, dy: 0 },
        }));
        window.addEventListener("mousemove", handleMousemove);
        window.addEventListener("mouseup", handleMouseup);
    }
    function handleMousemove(event) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        x = event.clientX;
        y = event.clientY;
        node.dispatchEvent(new CustomEvent("move", {
            detail: { x, y, dx, dy },
        }));
    }
    function handleMouseup() {
        window.removeEventListener("mousemove", handleMousemove);
        window.removeEventListener("mouseup", handleMouseup);
        node.dispatchEvent(new CustomEvent("moveEnd", {
            detail: { x, y, dx: 0, dy: 0 },
        }));
    }
    node.addEventListener("mousedown", handleMousedown);
    return {
        destroy() {
            node.removeEventListener("mousedown", handleMousedown);
        },
    };
}
