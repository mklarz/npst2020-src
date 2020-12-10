<script lang="ts">
	export let size: "sm" | "md" | "lg" = "md";
	export let fullWidth: boolean = false;
	export let disabled: boolean = false;
	export let primary: boolean = false;
	export let indented: boolean = false;
	export let type: "button" | "submit" = "button";
</script>

<button
	class={size}
	class:fullWidth
	class:primary
	class:indented
	{disabled}
	{type}
	on:click><slot /></button>

<style>
	button {
		position: relative;
		font-size: 1rem;
		user-select: none;
		font-family: inherit;
		cursor: pointer;
		outline: none;

		box-sizing: border-box;
		display: inline-block;
		background: var(--material);
		color: var(--material-text);

		border-style: solid;
		border-width: 2px;
		border-color: var(--border-light) var(--border-darkest)
			var(--border-darkest) var(--border-light);

		box-shadow: inset 1px 1px 0px 1px var(--border-lightest),
			inset -1px -1px 0 1px var(--border-dark);
	}

	button:focus:not(:disabled)::after,
	button:active:not(:disabled)::after {
		content: "";
		position: absolute;
		display: block;
		top: 4px;
		right: 4px;
		bottom: 4px;
		left: 4px;
		outline: 2px dotted var(--material-text);
	}

	button:active:not(:disabled) {
		border-color: var(--border-darkest) var(--border-light) var(--border-light)
			var(--border-darkest);

		box-shadow: inset 1px 1px 0px 1px var(--border-dark),
			inset -1px -1px 0 1px var(--border-lightest);
	}

	button:disabled {
		cursor: initial;
		/* -webkit-text-fill-color: var(--material-text-disabled); */
		color: var(--material-text-disabled);
		text-shadow: 1px 1px var(--material-text-disabled-shadow);
	}

	.primary::before {
		content: "";
		box-sizing: border-box;
		position: absolute;
		top: -2px;
		right: -2px;
		bottom: -2px;
		left: -2px;
		outline: 2px solid var(--border-darkest);
	}

	.fullWidth {
		width: 100%;
	}

	.sm {
		padding: 2px calc(2px + 0.4em);
	}

	.md {
		padding: calc(2px + 0.15em) calc(2px + 0.4em);
	}

	.lg {
		padding: calc(2px + 1em) calc(2px + 0.4em);
	}

	.indented {
		background-image: linear-gradient(
				45deg,
				var(--material) 25%,
				transparent 25%,
				transparent 75%,
				var(--material) 75%
			),
			linear-gradient(
				45deg,
				var(--material) 25%,
				transparent 25%,
				transparent 75%,
				var(--material) 75%
			);
		background-color: var(--border-lightest);
		background-size: 4px 4px;
		background-position: 0 0, 2px 2px;
		border-style: solid;
		border-width: 2px;
		border-left-color: var(--border-darkest);
		border-top-color: var(--border-darkest);
		border-right-color: var(--border-lightest);
		border-bottom-color: var(--border-lightest);
		box-shadow: inset 1px 1px 0px 1px var(--borderDark),
			inset -1px -1px 0 1px var(--borderLight);
	}
</style>
