<script lang="ts">let state = "initial";
function nextState(currentState) {
    switch (currentState) {
        case "initial":
            return "half-way";
        case "half-way":
            return "done";
        case "done":
            return "half-way";
    }
}
window.setInterval(() => (state = nextState(state)), 750);
</script>

<span role="img" aria-label="timeglass" class={state} />

<style>
	span::before {
		display: inline-block;
	}
	.initial::before {
		content: "⏳";
	}

	.half-way::before {
		content: "⌛";
	}

	.done::before {
		content: "⏳";
		animation: spin 750ms ease;
	}

	@keyframes spin {
		from {
			transform: rotate(180deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
