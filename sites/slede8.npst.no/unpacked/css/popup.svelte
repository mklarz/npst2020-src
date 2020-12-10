<script type="ts">export let hide;
</script>

<div class="blur" on:click={hide}>
	<div class="content" on:click|stopPropagation={() => {}}>
		<slot />
	</div>
</div>

<style>
	.blur {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		background-color: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(1px);
	}

	div.content {
		position: absolute;
		left: 50%;
		top: 40%;
		min-width: 60ch;
		transform: translate(-50%, -40%);
		background: var(--backgroundColor);
	}
</style>
