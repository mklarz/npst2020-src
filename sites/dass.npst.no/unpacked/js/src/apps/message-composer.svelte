<script lang="ts">
	import Window from "../components/window.svelte";

	import type { Submission } from "../utils/api";
	import { submit } from "../utils/api";
	import Button from "../components/button.svelte";
	import { apps } from "../store";
	import Alert from "./alert.svelte";
	import Cutout from "../components/cutout.svelte";

	export let message: Submission = {
		to: "",
		subject: "",
		content: "",
	};
	/** Internal window props */
	export let id: string;
	export let order: number;

	let submitPromise: Promise<void>;

	function handleSubmit() {
		submitPromise = submit(message)
			.then((data) =>
				apps.open({
					id: `${id}_alert`,
					parent: id,
					component: Alert,
					props: {
						title: "Sending vellykket",
						message: data.message,
						severity: "success",
						closeCallback: () => apps.close(id),
					},
				})
			)
			.catch((error) =>
				apps.open({
					id: `${id}_alert`,
					parent: id,
					component: Alert,
					props: {
						title: "Sending feilet",
						message: error.message,
						severity: "error",
					},
				})
			);
	}
</script>

<Window
	windowTitle={`✉️ ${message.subject} - Snabel-A`}
	{id}
	{order}
	width={550}
	height={400}>
	<form slot="content" on:submit|preventDefault={handleSubmit}>
		<div>
			<label for="recipient">Til:</label>
			<Cutout scrollable={false}>
				<input type="text" bind:value={message.to} name="recipient" />
			</Cutout>
		</div>
		<div>
			<label for="subject">Emne:</label>
			<Cutout scrollable={false}>
				<input type="text" bind:value={message.subject} name="subject" />
			</Cutout>
		</div>

		<Cutout scrollable={false}>
			<textarea bind:value={message.content} />
		</Cutout>

		{#await submitPromise}
			<Button type="submit" disabled>Sender ...</Button>
		{:then _}
			<Button type="submit">Send</Button>
		{/await}
	</form>
</Window>

<style>
	form {
		height: 100%;
		display: grid;
		grid-template-rows: auto auto 1fr auto;
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

	textarea {
		width: 100%;
		height: 100%;
		resize: none;
		border: none;
		outline: none;
		line-height: 1.5;
		padding: 0 0.2em;
	}
</style>
