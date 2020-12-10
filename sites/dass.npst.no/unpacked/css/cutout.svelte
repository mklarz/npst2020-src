<script lang="ts">export let shadow = false;
export let scrollable = true;
</script>

<div class="cutout" class:shadow>
	<div class="content" class:scrollable>
		<slot />
	</div>
</div>

<style>
	.cutout {
		position: relative;
		box-sizing: border-box;
		padding: 2px;
		font-size: 1rem;
		border-style: solid;
		border-width: 2px;
		border-left-color: var(--border-dark);
		border-top-color: var(--border-dark);
		border-right-color: var(--border-lightest);
		border-bottom-color: var(--border-lightest);
		line-height: 1.5;
		height: 100%;
		width: 100%;
	}

	.cutout::before {
		position: absolute;
		left: 0;
		top: 0;
		content: "";
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		border-style: solid;
		border-width: 2px;
		border-left-color: var(--border-darkest);
		border-top-color: var(--border-darkest);
		border-right-color: var(--border-light);
		border-bottom-color: var(--border-light);
		pointer-events: none;
	}

	.shadow::before {
		box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.35),
			inset 1px 1px 0px 1px var(--border-lightest),
			inset -1px -1px 0 1px var(--border-dark);
	}

	.content {
		width: 100%;
		height: 100%;
	}

	.scrollable {
		overflow: auto;
	}
</style>
