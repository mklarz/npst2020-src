<script>
	import Cutout from "./cutout.svelte";
</script>

<Cutout shadow={false}>
	<div class="wrapper">
		<table>
			<slot />
		</table>
	</div>
</Cutout>

<style>
	.wrapper {
		height: 100%;
		background-color: var(--canvas);
	}

	table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		font-size: 1rem;
	}

	table :global(thead) {
		display: table-header-group;
	}

	table :global(th) {
		position: relative;
		padding: 0.4em;
		display: table-cell;
		vertical-align: inherit;
		background: var(--material);
		cursor: default;
		color: var(--material-text);
	}

	table :global(th::before) {
		box-sizing: border-box;
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		border-style: solid;
		border-width: 2px;
		border-left-color: var(--border-lightest);
		border-top-color: var(--border-lightest);
		border-right-color: var(--border-darkest);
		border-bottom-color: var(--border-darkest);
		box-shadow: inset 1px 1px 0px 1px var(--border-light),
			inset -1px -1px 0 1px var(--border-dark);

		border-left: none;
		border-top: none;
	}

	table :global(th:active:not(:disabled)::before) {
		border-style: solid;
		border-width: 2px;
		border-left-color: var(--border-darkest);
		border-top-color: var(--border-darkest);
		border-right-color: var(--border-lightest);
		border-bottom-color: var(--border-lightest);
		box-shadow: inset 1px 1px 0px 1px var(--border-dark),
			inset -1px -1px 0 1px var(--border-light);
		border-left: none;
		border-top: none;
		padding-top: 2px;
	}

	table :global(th:disabled) {
		-webkit-text-fill-color: var(--material-text-disabled);
		color: var(--material-text-disabled);
		text-shadow: 1px 1px var(--material-text-disabled-shadow);
	}

	table :global(tbody) {
		background: var(--canvas);
		display: table-row-group;
		box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.2);
		overflow-y: auto;
	}

	table :global(tr) {
		display: table-row;
		height: 33px;
		line-height: 33px;
		vertical-align: middle;
		outline: none;
		color: var(--canvas-text);
	}

	table :global(tr:not(:last-of-type)) {
		border-bottom: 1px solid gainsboro;
	}

	table :global(tbody tr:hover) {
		background: var(--hover-background);
		color: var(--canvas-text-invert);
	}

	table :global(td) {
		padding: 8px;
	}
</style>
