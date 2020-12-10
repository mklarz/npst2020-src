<script lang="ts">import { onDestroy, onMount } from "svelte";
import ListDivider from "../components/list-divider.svelte";
import ListItem from "../components/list-item.svelte";
import List from "../components/list.svelte";
import ToolbarItem from "../components/toolbar-item.svelte";
import Toolbar from "../components/toolbar.svelte";
import Window from "../components/window.svelte";
import Table from "../components/table.svelte";
import CreateProfile from "./create-profile.svelte";
import MessageViewer from "./message-viewer.svelte";
import { apps, messages, user, clock } from "../store";
;
import MessageComposer from "./message-composer.svelte";
import Alert from "./alert.svelte";
/** Internal window props */
export let id;
export let order;
const STORAGE_KEY = "@@snabel-a.exe";
function readSavedState() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    }
    catch (_a) {
        localStorage.removeItem(STORAGE_KEY);
        return {};
    }
}
let appState = readSavedState();
function isUnread(message) {
    return appState[message.subject] === undefined;
}
function markAsRead(message) {
    appState[message.subject] = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}
$: userProfileCompleted = ($user === null || $user === void 0 ? void 0 : $user.email) !== null;
$: employeeCanWork = !($clock.user.getMonth() === 11 && $clock.user.getDate() === 5);
// Look for new messages every time the app gets focus
let hasFocus = false;
$: if (order === $apps.length - 1) {
    if (!hasFocus) {
        hasFocus = true;
        messages.lookForNewMessages();
    }
}
else {
    hasFocus = false;
}
function personalize(text) {
    return text
        .replace(new RegExp("{{email}}", "g"), ($user === null || $user === void 0 ? void 0 : $user.email) || "****@npst")
        .replace(new RegExp("{{display_name}}", "g"), ($user === null || $user === void 0 ? void 0 : $user.display_name) || "alvebetjent");
}
function openSettings() {
    apps.open({
        id: `${id}_create-profile`,
        parent: id,
        component: CreateProfile,
    });
}
function openComposer() {
    apps.open({
        id: `${id}_new-email`,
        parent: id,
        component: MessageComposer,
    });
}
function openMessage(message) {
    apps.open({
        id: `${id}_message`,
        parent: id,
        component: MessageViewer,
        props: { message: message },
    });
    markAsRead(message);
}
function openDenyWorkAlert() {
    apps.open({
        id: `${id}_deny-work`,
        parent: id,
        component: Alert,
        props: {
            title: "Arbeid avverget",
            message: `Grunnet den årlige markeringen til Aksjonsgruppa mot helgearbeid i adventstiden (AMHIA) er Snabel-A utilgjengelig den 5. desember i tidsrommet 00:00 til 23:59. Vennligst respekter dette.`,
            severity: "warning",
            closeCallback: () => apps.close(id),
        },
    });
}
let timeout;
let timeout2;
onMount(() => {
    messages.lookForNewMessages();
    if (!userProfileCompleted) {
        timeout = window.setTimeout(openSettings, 500);
    }
    if (!employeeCanWork) {
        timeout2 = window.setTimeout(openDenyWorkAlert, 500);
    }
});
onDestroy(() => {
    window.clearTimeout(timeout);
    window.clearTimeout(timeout2);
});
</script>

<Window windowTitle="📯 Snabel-A" {id} {order} width={800} height={600}>
	<div slot="toolbar">
		<Toolbar loading={$messages.state === 'LOADING'}>
			<ToolbarItem name="Fil">
				<List>
					<ListItem size="md" on:mouseup={openComposer}>Ny epost</ListItem>
					<ListItem size="md" on:mouseup={openSettings}>Innstillinger</ListItem>
					<ListDivider />
					<ListItem size="md" on:mouseup={() => apps.close(id)}>
						Avslutt Snabel-A
					</ListItem>
				</List>
			</ToolbarItem>
			<ToolbarItem name="Innboks">
				<List>
					<ListItem on:mouseup={messages.lookForNewMessages} size="md">
						Send/Motta
					</ListItem>
				</List>
			</ToolbarItem>
		</Toolbar>
	</div>
	<div slot="content" class="content">
		{#if employeeCanWork}
			{#if !$messages.data && $messages.state === 'ERROR'}
				<p>Noe gikk galt</p>
				<p>Prøv igjen snart!</p>
			{:else if !$messages.data}
				<p>Laster innhold...</p>
			{:else}
				<Table>
					<thead>
						<tr>
							<th />
							<th>Fra</th>
							<th>Emne</th>
							<th>Mottatt</th>
						</tr>
					</thead>

					<tbody>
						{#each $messages?.data || [] as message}
							<tr
								class:unread={isUnread(message)}
								on:click={() => openMessage(message)}>
								<td>{`${isUnread(message) ? '📬' : '✉️'}`}</td>
								<td>{message.from}</td>
								<td>{personalize(message.subject)}</td>
								<td>{new Date(message.sent).toLocaleString('nb')}</td>
							</tr>
						{/each}
					</tbody>
				</Table>
			{/if}
		{/if}
	</div>
</Window>

<style>
	div.content {
		height: 100%;
	}

	tr.unread {
		font-weight: bold;
	}

	td:first-of-type {
		text-align: center;
	}

	td:last-of-type {
		white-space: nowrap;
		width: 1%;
	}
</style>
