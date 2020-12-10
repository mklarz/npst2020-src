<script type="ts">export let label = null;
export let error = false;
</script>

<section class:error>
	{#if label}
		<h1 class:error>{label}</h1>
	{/if}
	<div>
		<slot />
	</div>
</section>

<style>
	section {
		position: relative;
		border: 2px solid gray;
		width: 100%;
		height: 100%;
	}

	section.error {
		border-color: var(--errorColor);
	}

	h1 {
		position: absolute;
		z-index: 1;
		display: inline-block;
		top: -1.5em;
		left: 0.5em;
		background-color: var(--primaryColor);
		padding: 0.2em 0.5em;
		font-size: 16px;
		font-weight: bold;
		color: black;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	h1.error {
		background-color: var(--errorColor);
	}

	div {
		width: 100%;
		height: 100%;
		padding: 1em 0.5em 0.5em 0.5em;
	}
</style>
