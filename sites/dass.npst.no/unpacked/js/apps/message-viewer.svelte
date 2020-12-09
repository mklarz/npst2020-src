<script lang="ts">
	import marked from "marked";
	import Cutout from "../components/cutout.svelte";
	import ListDivider from "../components/list-divider.svelte";
	import ListItem from "../components/list-item.svelte";
	import List from "../components/list.svelte";
	import ToolbarItem from "../components/toolbar-item.svelte";
	import Toolbar from "../components/toolbar.svelte";
	import Window from "../components/window.svelte";
	import { apps, user } from "../store";
	import type { Message, Submission } from "../utils/api";
	import MessageComposer from "./message-composer.svelte";

	export let message: Message;
	/** Internal window props */
	export let id: string;
	export let order: number;

	const personalize = (text: string): string =>
		text
			.replace(new RegExp("{{email}}", "g"), $user?.email || "****@npst")
			.replace(
				new RegExp("{{display_name}}", "g"),
				$user?.display_name || "alvebetjent"
			);

	let messageContentPromise: Promise<string>;
	if (message.content) {
		messageContentPromise = Promise.resolve(message.content);
	} else if (message.contentUrl) {
		messageContentPromise = fetch(message.contentUrl).then(
			async (res) => await res.text()
		);
	}

	const reply = () => {
		let template: Submission = {
			to: message.from,
			subject: `SV: ${message.subject}`,
			content: "",
		};
		apps.open({
			id: `${id}_reply`,
			parent: id,
			component: MessageComposer,
			props: { message: template },
		});
	};
</script>

<Window
	windowTitle={`✉️ ${message.subject} - Snabel-A`}
	{id}
	{order}
	width={600}
	height={550}>
	<div slot="toolbar">
		<Toolbar>
			<ToolbarItem name="Fil">
				<List>
					<ListItem size="md" on:mouseup={reply}>Svar</ListItem>
					<ListDivider />
					<ListItem size="md" on:mouseup={() => apps.close(id)}>
						Lukk vindu
					</ListItem>
				</List>
			</ToolbarItem>
			<ToolbarItem name="Rediger">
				<List>
					<ListItem size="md" disabled>Resirkuler</ListItem>
				</List>
			</ToolbarItem>
		</Toolbar>
	</div>
	<div slot="content" class="container">
		{#await messageContentPromise}
			<p>Laster ...</p>
		{:then messageContent}
			<dl>
				<dt>Fra</dt>
				<dd>{personalize(message.from)}</dd>

				<dt>Sendt</dt>
				<dd>{new Date(message.sent).toLocaleString()}</dd>

				<dt>Til</dt>
				<dd>{personalize(message.to.join(', '))}</dd>

				<dt>CC</dt>
				<dd>{personalize((message.cc || []).join(', '))}</dd>

				<dt>Emne</dt>
				<dd>
					<Cutout><span>{message.subject}</span></Cutout>
				</dd>
			</dl>

			<div class="content-wrapper">
				<Cutout>
					<div class="content">
						{@html marked(personalize(messageContent))}
					</div>
				</Cutout>
			</div>
		{/await}
	</div>
</Window>

<style>
	.container {
		height: 100%;
		display: grid;
		grid-template-rows: auto 1fr;
	}

	dl {
		display: grid;
		grid-template-columns: 8ch 1fr;
		align-items: center;
		margin-top: 0;
	}

	dt {
		margin: 0.2em 0;
	}

	dt::after {
		content: ":";
	}

	dd {
		margin: 0;
	}

	dd:last-of-type {
		background-color: var(--canvas);
		user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		-webkit-user-select: text;
	}

	dd span {
		margin: 0 0.2em;
	}

	.content-wrapper {
		overflow-x: auto;
		background-color: var(--canvas);
	}

	.content {
		user-select: text;
		margin: 1rem;
		-moz-user-select: text;
		-ms-user-select: text;
		-webkit-user-select: text;
		font-family: "Comic Neue", "Comic Sans", "Comic Sans MS", chalkboard,
			"Chalkboard SE Regular", "apple color emoji", "segoe ui emoji",
			"noto color emoji", "android emoji", "emojisymbols", "emojione mozilla",
			"twemoji mozilla", "segoe ui symbol", serif;
	}

	.content :global(code),
	.content :global(pre) {
		font-family: monospace, "apple color emoji", "segoe ui emoji",
			"noto color emoji", "android emoji", "emojisymbols", "emojione mozilla",
			"twemoji mozilla", "segoe ui symbol";
		background: var(--material);
		padding: 2px 0.5em;
	}

	.content :global(blockquote) {
		margin-left: 1em;
		padding: 1px 0 1px 1em;
		border-left: 1px solid var(--material-dark);
		color: var(--material-dark);
	}
</style>
