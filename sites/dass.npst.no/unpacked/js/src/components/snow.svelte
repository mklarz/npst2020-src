<script lang="ts">
	import { onMount } from "svelte";

	let snowflakes = new Array(150)
		.fill(0)
		.map((_, i) => {
			return {
				x: Math.random() * 100 - 3,
				y: -20 - Math.random() * 100,
				r: 0.1 + Math.random() * 1,
			};
		})
		.sort((a, b) => a.r - b.r);

	onMount(() => {
		let frame: number;

		function loop() {
			frame = requestAnimationFrame(loop);

			snowflakes = snowflakes.map((emoji) => {
				emoji.y += 0.7 * emoji.r;
				if (emoji.y > 120) emoji.y = -20;
				return emoji;
			});
		}

		loop();

		return () => {
			cancelAnimationFrame(frame);
		};
	});
</script>

<section aria-hidden="true">
	{#each snowflakes as e}
		<span
			style="left: {e.x}%; top: {e.y}%; transform: scale({e.r})"
			role="img"
			aria-hidden="true">
			❄
		</span>
	{/each}
</section>

<style>
	section {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
	}

	span {
		position: absolute;
		font-size: 3rem;
		opacity: 1;
	}
</style>
