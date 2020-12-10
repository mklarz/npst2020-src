<script lang="ts">
	import Alert from "./alert.svelte";
	import Button from "../components/button.svelte";
	import Window from "../components/window.svelte";
	import { apps, user } from "../store";
	import type { EditableUser } from "../utils/api";
	import { whoiam } from "../utils/api";
	import Cutout from "../components/cutout.svelte";

	/** Internal window props */
	export let id: string;
	export let order: number;

	let profile: EditableUser = {
		display_name: $user?.display_name || "",
		email: $user?.email || "",
	};

	let updateProfilePromise: Promise<void> | null = null;
	const updateProfile = () => {
		updateProfilePromise = whoiam(profile)
			.then((_) => {
				apps.close(id);
			})
			.catch((error) => {
				console.log(error);
				apps.open({
					id: `${id}-error`,
					parent: id,
					component: Alert,
					props: {
						title: "Lagring feilet",
						message: error.message,
						severity: "warning",
					},
				});
			});
	};
</script>

<Window
	windowTitle="📯 Snabel-A - Instillinger"
	{id}
	{order}
	width={500}
	height={440}>
	<form slot="content" on:submit|preventDefault={updateProfile}>
		<h1>Rediger profil</h1>
		<div>
			<label for="alias">Alias:</label>
			<Cutout scrollable={false}>
				<input type="text" name="alias" bind:value={profile.display_name} />
			</Cutout>
		</div>

		<div>
			<label for="email">E-post:</label>
			<Cutout scrollable={false}>
				<input type="email" name="email" bind:value={profile.email} />
			</Cutout>
		</div>

		<p>
			* Ved å oppgi en gyldig epostadresse får du muligheten til å vinne
			premier. Dette er følgelig helt frivillig! Epostadresser vil kun bli
			benyttet til å kontakte eventuelle vinnere, og de vil bli slettet etter at
			alle vinnere har blitt utropt.
		</p>

		{#await updateProfilePromise}
			<Button primary fullWidth disabled type="submit">Laster...</Button>
		{:then _}
			<Button primary fullWidth type="submit">Lagre</Button>
		{/await}
	</form>
</Window>

<style>
	h1 {
		margin: 0;
		padding: 0;
	}

	form {
		height: 100%;
		display: grid;
		grid-template-rows: auto auto auto 1fr auto;
		row-gap: 0.5rem;
		-moz-row-gap: 0.5rem;
		-webkit-row-gap: 0.5rem;
	}

	form > div {
		display: grid;
		grid-template-columns: 8ch 1fr;
		align-items: center;
	}

	label {
		width: 5em;
		display: inline-block;
	}

	input {
		width: 100%;
		display: inline-block;
		border: none;
		outline: none;
		line-height: 1.5;
		padding: 0 0.2em;
	}
</style>
