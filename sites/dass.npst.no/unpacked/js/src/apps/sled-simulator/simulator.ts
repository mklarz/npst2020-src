import asn from "asn1js";
import { step } from "@pstnorge/slede8";
export const timeBetweenFrames = ~~(1000 / 30);
export const width = 255;
export const height = 255;
export const target = {
    x: ~~(width / 2) - 20,
    y: height - 25,
    w: 40,
    h: 25,
};
const unit = 10;
const framesPerSecond = 1000 / timeBetweenFrames;
const unitToScale = unit / framesPerSecond;
const g = 9 * unitToScale;
const vThrusterForce = -11.0 * unitToScale;
const hThrusterForce = 1.0 * unitToScale;
const getRNG = (seed) => () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const range = (count, start = 0) => {
    return Array(count)
        .fill(null)
        .map((x, i) => i + start);
};
const encodePosition = (pos) => {
    const sequence = new asn.Sequence();
    sequence.valueBlock.value.push(new asn.Integer({ value: pos.x & 0xff }));
    sequence.valueBlock.value.push(new asn.Integer({ value: pos.y & 0xff }));
    return sequence;
};
const encodeTarget = () => {
    const sequence = new asn.Sequence();
    sequence.valueBlock.value.push(encodePosition({ x: target.x, y: target.y }));
    sequence.valueBlock.value.push(encodePosition({ x: target.x + target.w, y: target.y + target.h }));
    return sequence;
};
const encodeFøde = (input) => {
    let sequence = new asn.Sequence();
    sequence.valueBlock.value.push(encodePosition(input.pos)); // currPos
    sequence.valueBlock.value.push(encodePosition(input.prevPos)); // prevPosition
    sequence.valueBlock.value.push(encodeTarget()); // target
    return new Uint8Array(sequence.toBER());
};
function decodeOppgulp(oppgulp) {
    // const oppgulp = [0x30,0x09,0x01,0x01,0x00,0x01,0x01,0xff,0x01,0x01,0xff];
    const byte = (value) => value.toString(16).padStart(2, "0");
    const formatted = [...oppgulp].map(byte).join(""); // split 0101, i.e. single byte BOOLEAN
    const matches = formatted.match(/^30090101([0-9a-f]{2})0101([0-9a-f]{2})0101([0-9a-f]{2})$/);
    // validate output
    if ((matches === null || matches === void 0 ? void 0 : matches.length) !== 4)
        throw new Error("Ugyldig oppgulp!");
    const [leftThruster, rightThruster, verticalThruster] = matches
        .slice(1)
        .map((x) => parseInt(x, 16) > 0);
    return [leftThruster, rightThruster, verticalThruster];
}
function runAutopilot(firmware, input) {
    const føde = encodeFøde(input);
    const N = 500;
    const session = step(firmware, føde, N);
    const init = session.next();
    // randomize registers
    range(16).forEach((i) => (init.value.regs[i] = ~~(Math.random() * 256)));
    // run to completion
    while (true) {
        const { done, value } = session.next();
        if (done) {
            return decodeOppgulp(value.stdout);
        }
    }
}
export function* simulation(seed, autopilot) {
    const random = getRNG(seed);
    let tick = 0;
    let state = {
        x: ~~(width / 2),
        y: ~~(height / 2),
        dx: ~~(20 * random() * hThrusterForce * Math.sign(-0.5 + random())),
        dy: ~~(g * random()),
        thrusters: [false, false, false],
    };
    while (true) {
        const prevPos = { x: state.x, y: state.y };
        state = move(state);
        const autoPilotInput = { prevPos, pos: { x: state.x, y: state.y }, target };
        const thrusters = runAutopilot(autopilot, autoPilotInput);
        state = Object.assign(Object.assign({}, state), { thrusters, time: ++tick });
        if (onTarget(state)) {
            // console.log("JULEN ER KANSKJE REDDET!", state);
            state.thrusters = [false, false, false];
            return Object.assign(Object.assign({}, state), { thrusters: [false, false, false] });
        }
        if (state.x < 0 || state.x > width || state.y < 0 || state.y > height) {
            // console.error("LANDING FEILET", state);
            return Object.assign(Object.assign({}, state), { thrusters: [false, false, false] });
        }
        yield state;
    }
}
function onTarget(state) {
    return (state.x > target.x && state.x < target.x + target.w && state.y >= target.y);
}
function softLanding(state) {
    return Math.abs(state.dy) < 3 && Math.abs(state.dx) < 2;
}
export function getResult(state) {
    if (!onTarget(state))
        return {
            message: "Landing feilet: Sleden bommet på målet.",
            success: false,
        };
    if (!softLanding(state))
        return {
            message: "Landing feilet: Sleden hadde for stor hastighet i landingen.",
            success: false,
        };
    return {
        message: `Landing vellykket etter ${state.time} iterasjoner!`,
        success: true,
    };
}
function move(state) {
    const [lthruster, rthruster, vthruster] = state.thrusters;
    let dy = state.dy + g;
    let dx = state.dx;
    if (vthruster)
        dy += vThrusterForce;
    if (rthruster)
        dx -= hThrusterForce;
    if (lthruster)
        dx += hThrusterForce;
    return Object.assign(Object.assign({}, state), { x: state.x + dx, y: state.y + dy, dx,
        dy });
}
