<script lang="ts">import { onDestroy } from "svelte";
import { getCountdownTime } from "../utils";
export let active;
let xAxis = 0;
let yAxis = 0;
let smoothIn = true;
let smoothOut = false;
let popout = false;
let countdown = getCountdownTime();
let interval = setInterval(() => (countdown = getCountdownTime()), 1000);
onDestroy(() => clearInterval(interval));
</script>

<div id="container">
	<div
		id="overlay"
		on:mouseout={() => {
			smoothOut = false;
			smoothOut = true;
			popout = false;
			active = false;
			xAxis = 0;
			yAxis = 0;
		}}
		on:mouseenter={() => {
			smoothOut = false;
			smoothIn = true;
			popout = true;
			active = true;
			setTimeout(() => (smoothIn = false), 75);
		}}
		on:mousemove={(e) => {
			const boundingRect = e.currentTarget.getBoundingClientRect();
			xAxis = (boundingRect.width / 2 + boundingRect.left - e.pageX) / (boundingRect.width / 25);
			yAxis = (boundingRect.height / 2 + boundingRect.top - e.pageY) / (boundingRect.height / 25);
		}} />
	<article
		class:smoothIn
		class:smoothOut
		style="transform: rotateX({yAxis}deg) rotateY({-xAxis}deg)">
		<span role="img" aria-label="julenissen" class:popout id="santa">🎅</span>
		<h1 class:popout>HO HO HO!</h1>
		<p class:popout>
			Adventstiden nærmer seg, og jeg har igjen behov for flere hjelpere. Det har
			skjedd mye spennende siden sist, så jeg håper du er klar til dyst. Dere
			gjorde en strålende innsats sist desember, men jeg har desverre observert
			at SPST igjen har økt sin aktivitet inn mot desember.
		</p>
		<p class:popout>
			<b>For å være sikker på at julen ikke går i dass vil jeg trenge din hjelp!</b>
		</p>
		<span class:popout id="countdown">{countdown}</span>
	</article>
</div>

<style>
	#container {
		position: relative;
		width: 800px;
		max-width: 100%;
		margin: clamp(2rem, 10vh, 10vh) auto 2rem;
		perspective: 1000px;
	}

	article {
		transform-style: preserve-3d;
		height: 100%;
		background: blanchedalmond;
		padding: 1rem 3rem;
		border-radius: 5px;
		width: clamp(320px, 80%, 650px);
		margin: 0 auto;
		box-shadow: 0 20px 20px rgba(0, 0, 0, 0.2), 0 0 50px rgba(0, 0, 0, 0.2);
	}

	article.smoothIn {
		transition: all 75ms ease;
	}

	article.smoothOut {
		transition: all 200ms ease;
	}

	#overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0.5;
		z-index: 2;
	}

	h1 {
		margin: 3rem 0 2rem;
		text-align: center;
		text-transform: uppercase;
		transition: all 500ms ease;
		font-size: 3rem;
	}

	h1.popout {
		transform: translateZ(120px);
	}

	p {
		font-size: large;
		line-height: 1.5;
		transition: all 500ms ease;
	}

	p.popout {
		transform: translateZ(75px);
	}

	#santa {
		font-size: 10rem;
		display: block;
		text-align: center;
		transition: all 500ms ease;
	}

	#santa.popout {
		transform: translateZ(150px) rotate(-180deg);
	}

	#countdown {
		display: block;
		text-align: center;
		margin: 2rem 0;
		font-size: 2rem;
		font-family: monospace;
		font-weight: bold;
		transition: all 500ms ease;
	}

	#countdown.popout {
		transform: translateZ(75px);
	}
</style>
