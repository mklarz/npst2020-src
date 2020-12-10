<script lang="ts">import Window from "../components/window.svelte";
import Cutout from "../components/cutout.svelte";
/** Internal window props */
export let id;
export let order;
</script>

<Window windowTitle="ℹ Informasjon" {id} {order} width={650} height={550}>
	<div slot="content" class="content">
		<Cutout>
			<div class="wrapper">
				<h1>Regler</h1>
				<ul>
					<li>
						Det er ikke tillatt å tilegne seg tilgang til andre brukeres konto.
					</li>
					<li>
						Det er ikke tillatt å angripe/bruteforce APIer på
						<code>dass.npst.no</code>.
					</li>
					<li>Det er ikke tillatt å bruke støtende alias.</li>
					<li>Det er lov å samarbeide.</li>
					<li>
						Vi oppfordrer sterkt til å ikke publisere løsningsforlag åpent før
						tidligst 25. desember.
					</li>
				</ul>
				<p>
					Ved brudd på reglene forbeholder vi oss retten til å endre alias,
					blokkere og/eller fjerne brukere uten forvarsel.
				</p>
				<h1>Generell informasjon</h1>
				<p>
					Poenggivende flagg er på formen
					<code>{`PST{.*}`}</code>, eksempelvis
					<code>{`PST{littTekstOgTall}`}</code>.
				</p>
				<p>
					Flagg leveres i
					<code>Snabel-A</code>
					som svar til
					<code>Mellomleder</code>
					på dagens oppgave.
				</p>
				<p>
					Ved å oppgi en gyldig epostadresse får du muligheten til å vinne
					premier. Dette er følgelig helt frivillig! Epostadresser vil kun bli
					benyttet til å kontakte eventuelle vinnere, og de vil bli slettet
					etter at alle vinnere har blitt utropt. Du kan når som helst endre
					eposten din under
					<code>Instillinger</code>
					i applikasjonen
					<code>Snabel-A</code>.
				</p>
				<p>
					Kun brukere som har oppgitt en gyldig epost kan vinne premier.
					Vinneren av julekalenderen vil bli tilfeldig trukket ut blant alle
					deltakerne, jo flere poeng du har, jo større vil sansynligheten for å
					bli trukket ut være.
				</p>
				<p>
					Alle brukerkontoer og tilhørende data vil bli slettet etter at alle
					vinnere har blitt utropt, senest 1. februar 2021.
				</p>
				<h1>Samarbeid</h1>
				<p>
					Det finnes en uoffisiell
					<a
						href="https://discord.gg/8kvF3aU"
						target="_blank"
						rel="noopener noreferrer">Discord-kanal</a>
					som i fjor ble flittig brukt av mange deltagere. Vi oppfordrer alle
					som ønsker å diskutere oppgavene med andre om å benytte seg av denne.
					PST har ingen ting med kanalen å gjøre, men har fått lov til å ha en
					bruker tilstede som man kan stille spørsmål til dersom man ønsker det.
					Vennligst respekter reglene administratorene av kanalen har satt.
				</p>
			</div>
		</Cutout>
	</div>
</Window>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	.wrapper {
		padding: 0.5em;
		min-height: 100%;
		background: var(--canvas);
		user-select: text;
	}

	.wrapper {
		font-family: "Comic Neue", "Comic Sans", "Comic Sans MS", chalkboard,
			"Chalkboard SE Regular", "apple color emoji", "segoe ui emoji",
			"noto color emoji", "android emoji", "emojisymbols", "emojione mozilla",
			"twemoji mozilla", "segoe ui symbol", serif;
	}

	code {
		font-family: monospace;
		background: var(--material);
		padding: 2px 0.5em;
	}

	h1:first-of-type {
		margin-top: 0;
	}
</style>
