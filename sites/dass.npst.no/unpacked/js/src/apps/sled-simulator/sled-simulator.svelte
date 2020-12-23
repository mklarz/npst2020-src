<script lang="ts">
	import Window from "../../components/window.svelte";
	import Toolbar from "../../components/toolbar.svelte";
	import ToolbarItem from "../../components/toolbar-item.svelte";
	import List from "../../components/list.svelte";
	import ListItem from "../../components/list-item.svelte";
	import ListDivider from "../../components/list-divider.svelte";
	import Button from "../../components/button.svelte";
	import { apps } from "../../store";
	import Document from "../document.svelte";
	import type { Result, State } from "./simulator";
	import { getResult, simulation, target } from "./simulator";
	import type { HTMLEvent } from "../../utils/types";
	import Snow from "../../components/snow.svelte";
	import Cutout from "../../components/cutout.svelte";
	import Alert from "../alert.svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;

	let state: State | null = null;
	let seed = 24;

	let result: Result = {
		message: null,
		success: false,
	};

	let uploadProgress: Promise<void> | null = null;

	let fileName: string | null = null;
	$: windowTitle = `🛷 Sledesimulator${
		fileName !== null ? " - " + fileName : ""
	}`;
	let firmware = new Uint8Array([
		0x2e,
		0x53,
		0x4c,
		0x45,
		0x44,
		0x45,
		0x38,
		0x01,
		0x01,
		0x11,
		0x00,
		0x21,
		0x01,
		0xa1,
		0x30,
		0x91,
		0x09,
		0xb1,
		0x01,
		0x16,
		0x0a,
		0x16,
		0x09,
		0x16,
		0x0b,
		0x16,
		0x0b,
		0x16,
		0x00,
		0x16,
		0x0b,
		0x16,
		0x0b,
		0x16,
		0x01,
		0x16,
		0x0b,
		0x16,
		0x0b,
		0x16,
		0x02,
	]);

	function loadFirmware() {
		const input = document.createElement("input");
		input.type = "file";
		input.onchange = (event: HTMLEvent<HTMLInputElement>) => {
			const reader = new FileReader();
			fileName = input.value.split(/(\\|\/)/g).pop() || null;
			console.log(fileName);
			reader.onload = function () {
				firmware = new Uint8Array(this.result as ArrayBuffer);
				console.log("Updated firmware to", firmware);
				input.remove(); // cleanup
			};

			reader.readAsArrayBuffer((event.currentTarget.files || [])[0]);
		};
		input.click();
	}

	function uploadFirmware() {
		uploadProgress = fetch("/.netlify/functions/fastvareoppdatering", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fastvare: [...firmware] }),
		})
			.then(async (res) => {
				let data = (await res.json()) as Result;
				apps.open({
					id: `${id}_alert`,
					parent: id,
					component: Alert,
					props: {
						title: `Status`,
						message: data.message,
						severity: data.success ? "success" : "error",
					},
				});
			})
			.catch(async (res) => {
				console.warn(res);
				apps.open({
					id: `${id}_alert`,
					parent: id,
					component: Alert,
					props: {
						title: `Status`,
						message: "Installasjon feilet",
						severity: "error",
					},
				});
			});
	}

	function runSimulation() {
		result = { message: null, success: false };
		const timeBetweenFrames = 100;
		let lastFrame = 0;
		const frames = simulation(seed, firmware);
		const renderFrame = () => {
			let now = Date.now();
			if (now - lastFrame < timeBetweenFrames) {
				requestAnimationFrame(renderFrame);
				return;
			}
			lastFrame = now;

			try {
				const { done, value } = frames.next();
				state = value;
				if (done) {
					result = getResult(value);
					console.log("DONE!!!", value);
					return;
				}
				requestAnimationFrame(renderFrame);
			} catch (e) {
				result = {
					success: false,
					message: e,
				};
			}
		};
		requestAnimationFrame(renderFrame);
	}

	function openSpec() {
		apps.open({
			component: Document,
			id: id + "_document",
			parent: id,
			props: {
				title: "Sledesimulatorspesifikasjon",
				content: `
Position ::= SEQUENCE {
	x INTEGER(0..255),
	y INTEGER(0..255)
}

Target ::= SEQUENCE {
	upperLeftCorner Position,
	lowerRightCorner Position
}

AutopilotFøde ::= SEQUENCE {
	currPos Position,
	prevPos Position,
	target Target
}

AutopilotOppgulp ::= SEQUENCE {
	leftThruster BOOLEAN,
	rightThruster BOOLEAN,
	verticalThruster BOOLEAN
}
				`,
			},
		});
	}
</script>

<Window {windowTitle} {id} {order} width={500} height={400} resizable={false}>
	<div slot="toolbar">
		<Toolbar>
			<ToolbarItem name="Fil">
				<List>
					<ListItem size="md" on:mouseup={openSpec}>
						Åpne spesifikasjoner
					</ListItem>
					<ListDivider />
					<ListItem size="md" on:mouseup={() => apps.close(id)}>
						Avslutt sledesimulator
					</ListItem>
				</List>
			</ToolbarItem>
			<ToolbarItem name="Simulering">
				<List>
					<ListItem size="md" on:mouseup={runSimulation}>
						Kjør simulering
					</ListItem>
					<ListItem size="md" on:mouseup={loadFirmware}>
						Last inn fastvare
					</ListItem>
				</List>
			</ToolbarItem>
		</Toolbar>
	</div>
	<div slot="content">
		<div id="content">
			<div id="simulator">
				<Snow count={50} size="sm" />
				<span />
				<span
					id="sled"
					style="--x: {state?.x || 124}px; --y: {state?.y || 124}px">
					🛷
					<span id="santa">
						{#if result.message && !result.success}💥{:else}🎅{/if}
					</span>
					<span class:hidden={!state?.thrusters[0]} id="lthruster">🔥</span>
					<span class:hidden={!state?.thrusters[1]} id="rthruster">🔥</span>
					<span class:hidden={!state?.thrusters[2]} id="vthruster">🔥</span>
				</span>
				<div
					id="chimney"
					style="--top: {target.y}px; --left: {target.x}px; --width: {target.w}px; --height: {target.h}px" />
			</div>
			<div id="state">
				<label for="seed">Inngangsverdi</label>
				<div>
					<Cutout scrollable={false}>
						<input type="number" id="seed" bind:value={seed} />
					</Cutout>
				</div>
				<hr />
				<ul>
					<li />
					<li>x:&nbsp; {~~(state?.x || 124)}</li>
					<li>y:&nbsp; {~~(state?.y || 124)}</li>
					<li>dx: {~~(state?.dx || 0)}</li>
					<li>dy: {~~(state?.dy || 0)}</li>

					{#if result.message}
						<li>
							<p>{result.message}</p>
							{#if result.success}
								<p>
									{#await uploadProgress}
										<Button fullWidth disabled>Redd julen</Button>
									{:then}
										<Button fullWidth on:click={uploadFirmware}>
											Redd julen
										</Button>
									{/await}
								</p>
							{/if}
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</Window>

<style>
	div#content {
		display: flex;
		flex-direction: row;
	}

	div#simulator {
		width: 255px;
		height: 255px;
		position: relative;
		margin: 1em;
		/* position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);*/
		background: darkblue;
	}

	div#state {
		width: calc(100% - 256px - 2em);
	}

	div#state ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	label {
		display: inline-block;
	}

	input {
		width: 100%;
		display: inline-block;
		border: none;
		outline: none;
		line-height: 1.5;
		padding: 0 0.2em;
	}

	.hidden {
		visibility: hidden;
	}

	#chimney {
		position: absolute;
		background: firebrick;
		top: var(--top);
		left: var(--left);
		width: var(--width);
		height: var(--height);
	}

	#sled {
		z-index: 1;
		position: absolute;
		top: var(--y);
		left: var(--x);
		transform: translate(-50%, -50%);
	}

	#santa {
		position: absolute;
		left: 0;
		top: -50%;
	}

	#lthruster {
		position: absolute;
		top: 100%;
		left: 0;
		transform: translate(-50%, -50%) rotate(-90deg);
		transform-origin: left;
	}

	#rthruster {
		position: absolute;
		top: 90%;
		left: 100%;
		transform: translate(-50%, -50%) rotate(90deg);
		transform-origin: right;
	}

	#vthruster {
		position: absolute;
		top: 10%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(180deg);
		transform-origin: bottom;
	}
</style>
