<div id="container">
	<article>
		<span role="img" aria-label="julenissen" id="santa">🎅</span>
		<h1>Ho ho ho!</h1>
		<p>
			Jaggu, da var det dags gitt! Logg inn i vårt helt nye
			<i>digitale arkiv- og saksbehandlingssystem</i>, DASS.
		</p>
		<div><a href="https://dass.npst.no">Gå til DASS</a></div>
	</article>
</div>

<style>
	#container {
		position: relative;
		width: 800px;
		max-width: 100%;
		margin: clamp(2rem, 10vh, 10vh) auto 2rem;
	}

	article {
		height: 100%;
		background: blanchedalmond;
		padding: 1rem 3rem;
		border-radius: 5px;
		width: clamp(320px, 80%, 650px);
		margin: 0 auto;
		box-shadow: 0 20px 20px rgba(0, 0, 0, 0.2), 0 0 50px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	h1 {
		margin: 3rem 0 2rem;
		text-transform: uppercase;
		font-size: 3rem;
	}

	p {
		font-size: large;
		line-height: 1.5;
	}

	article > div {
		margin: 3rem 0;
	}

	a {
		font-size: 1.2rem;
		padding: 0.75em 2em;
		border: none;
		border-radius: 5px;
		background: firebrick;
		color: azure;
		cursor: pointer;
		text-decoration: none;
	}

	#santa {
		font-size: 10rem;
		display: block;
	}
</style>
