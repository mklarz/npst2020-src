<script type="ts">export let disabled = false;
export let fullWidth = false;
export let fullHeight = false;
export let gray = false;
export let error = false;
</script>

<button
	{disabled}
	class:error
	class:gray
	on:click
	class:fullWidth
	class:fullHeight><slot /></button>

<style>
	button {
		cursor: pointer;
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

	button.fullWidth {
		width: 100%;
	}

	button.fullHeight {
		height: 100%;
	}

	button.gray,
	button:disabled {
		color: var(--borderColor);
		border-color: var(--borderColor);
	}

	button.error {
		color: var(--errorColor);
		border-color: var(--errorColor);
	}

	button:active {
		color: var(--primaryColorAccent);
		border-color: var(--primaryColorAccent);
	}

	button.error:active {
		color: var(--errorColorAccent);
		border-color: var(--errorColorAccent);
	}

	button:disabled {
		cursor: default;
	}
</style>
