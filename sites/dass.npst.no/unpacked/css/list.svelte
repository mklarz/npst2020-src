<script lang="ts">export let fullWidth = false;
export let inline = false;
export let shadow = false;
</script>

<ul class:fullWidth class:inline class:shadow>
	<slot />
</ul>

<style>
	ul {
		width: 100%;
		margin: 0;
		box-sizing: border-box;
		padding: 4px;

		border: 2px solid;
		border-color: var(--border-light) var(--border-darkest)
			var(--border-darkest) var(--border-light);
		box-shadow: inset 1px 1px 0px 1px var(--border-lightest),
			inset -1px -1px 0 1px var(--border-dark);

		display: inline-block;
		background: var(--material);
		color: var(--material-text);
		list-style: none;
		position: relative;
	}

	.shadow {
		box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.35),
			inset 1px 1px 0px 1px var(--border-lightest),
			inset -1px -1px 0 1px var(--border-dark);
	}

	.fullWidth {
		width: 100%;
	}

	.inline {
		display: inline-flex;
		align-items: center;
	}
</style>
