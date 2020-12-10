<script lang="ts">import { onMount } from "svelte";
export let characters = ["❄", "🎄", "🤶", "🎅", "⛄", "🎁", "🛷", "🦌"];
export let visible = false;
let emojies = new Array(150)
    .fill(0)
    .map((_, i) => {
    return {
        character: characters[i % characters.length],
        x: Math.random() * 100 - 3,
        y: -20 - Math.random() * 100,
        r: 0.1 + Math.random() * 1,
    };
})
    .sort((a, b) => a.r - b.r);
onMount(() => {
    let frame;
    function loop() {
        frame = requestAnimationFrame(loop);
        emojies = emojies.map((emoji) => {
            emoji.y += 0.7 * emoji.r;
            if (emoji.y > 120)
                emoji.y = -20;
            return emoji;
        });
    }
    loop();
    return () => {
        cancelAnimationFrame(frame);
    };
});
</script>

<section aria-hidden="true" class:visible>
	{#each emojies as e}
		<span
			style="left: {e.x}%; top: {e.y}%; transform: scale({e.r})"
			role="img"
			aria-hidden="true">
			{e.character}
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
		opacity: 0;
		transition: opacity 500ms ease;
	}

	.visible {
		opacity: 1;
	}

	span {
		position: absolute;
		font-size: 5vw;
		opacity: 1;
	}
</style>
