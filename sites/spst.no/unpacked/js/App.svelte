<script lang="ts">
	import { onMount } from "svelte";

	export let points = 0;

	type Emoji = {
		character: string;
		display: string;
		x: number;
		y: number;
		r: number;
	}

	let characters = ["🛷", "🐧"]


	let emojies: Emoji[] = new Array(150)
		.fill(0)
		.map((_, i) => {
			return {
				character: characters[i % characters.length],
				display: characters[i % characters.length],
				x: Math.random() * 100 - 3,
				y: -20 - Math.random() * 100,
				r: 0.1 + Math.random() * 1,
			};
		})
		.sort((a, b) => a.r - b.r);

	function onTouch(emoji: Emoji) {
		if (emoji.character !== emoji.display) return;
		if (emoji.character === "🐧") {
			emoji.display = "😲";
			points = Math.max(0, points - 10);
		} else {
			emoji.display = "💥";
			points += 1;
		}
	}

	onMount(() => {
		let frame: number;

		function loop() {
			frame = requestAnimationFrame(loop);

			emojies = emojies.map((emoji) => {
				emoji.y += 0.7 * emoji.r;
				if (emoji.y > 120) {
					emoji.y = -20;
					emoji.display = emoji.character;
				}
				return emoji;
			});
		}

		loop();

		return () => {
			cancelAnimationFrame(frame);
		};
	});
</script>

<main>
	{#if points > 10}
	<aside>
		<h1>{points}</h1>
	</aside>
	{/if}

	{#each emojies as e}
		<span
			style="left: {e.x}%; top: {e.y}%; transform: scale({e.r})"
			role="img"
			on:click={() => onTouch(e)}
			on:mouseover={() => onTouch(e)}>
			{e.display}
		</span>
	{/each}
</main>

<style>
	main {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		cursor: crosshair;
	}
	
	aside {
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		display: inline-block;
		padding: 2rem;
		background: rgba(0, 0, 0, 0.5);
	}

	h1 {
		color: white;
		font-size: 5rem;
		margin: 0;
	}

	span {
		position: absolute;
		font-size: 5vw;
		opacity: 1;
		user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
		cursor: crosshair;
	}
</style>
