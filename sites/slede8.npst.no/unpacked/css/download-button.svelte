<script type="ts">export let href;
export let download;
export let disabled = false;
export let fullWidth = false;
</script>

<a {href} {disabled} {download} class:fullWidth><slot /></a>

<style>
	a {
		display: inline-block;
		text-decoration: none;
		text-align: center;
		color: var(--primaryColor);
		border: 1px solid var(--primaryColor);
		background: var(--backgroundColor);
		font-weight: bold;
		padding: 0.2em 0.5em;
		outline: none;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	a:active {
		color: var(--primaryColorAccent);
		border: 1px solid var(--primaryColorAccent);
	}

	a.fullWidth {
		width: 100%;
	}
</style>
