<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { scale } from "svelte/transition";
	import ChristmasCard from "./components/christmas-card.svelte";
	import EmojiRain from "./components/emoji-rain.svelte";
	import Invitation from "./components/invitation.svelte";
	import { logSanta, RELEASE_TIME } from "./utils";

	let characters = ["❄", "🎄", "🤶", "🎅", "⛄", "🎁", "🛷", "🦌"];
	let visible: boolean = false;
	let isReleased = RELEASE_TIME - Date.now() <= 0;

	let interval = setInterval(
		() => (isReleased = RELEASE_TIME - Date.now() <= 0),
		1000
	);

	onMount(logSanta);
	onDestroy(() => clearInterval(interval));
</script>

{#if isReleased}
	<EmojiRain characters={['🚽']} visible />
	<div in:scale={{ duration: 500, delay: 500 }}>
		<Invitation />
	</div>
{:else}
	<EmojiRain {characters} {visible} />
	<div out:scale={{ duration: 500 }}>
		<ChristmasCard bind:active={visible} />
	</div>
{/if}
