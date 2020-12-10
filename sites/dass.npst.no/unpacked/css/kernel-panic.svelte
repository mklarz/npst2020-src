<script lang="ts">import { kernelPanic } from "../store";
</script>

<div>
	<p>
		Et problem har blitt oppdaget og DASS har blitt avsluttet for å forhindre
		skade på systemet.
	</p>
	<p>
		Problemet ser ut til å være forårsaket av følgende modul: SLUTTBRUKER.DLL
	</p>
	<p>Teknisk informasjon:</p>
	<div class="row">
		<figure>
			<img src="/a69c8648be9a29c7f987f25816a83c4e.png" alt="qr-code" />
		</figure>
		<pre>{$kernelPanic.trim()}</pre>
	</div>
</div>

<style>
	div {
		box-sizing: border-box;
		background-color: var(--header-background);
		color: white;
		width: 100vw;
		height: 100vh;
		padding: 2em;
		font-size: 150%;
	}

	div.row {
		display: flex;
		margin: 0;
		padding: 0;
	}

	figure {
		margin: 0 2em 0 0;
		padding: 0;
	}

	pre {
		margin: 0;
		padding: 0;
	}
</style>
