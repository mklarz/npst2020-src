<script lang="ts">import Button from "../components/button.svelte";
import Cutout from "../components/cutout.svelte";
import Window from "../components/window.svelte";
import { apps, snowing } from "../store";
import Alert from "./alert.svelte";
import Email from "./email.svelte";
import Enhance from "./enhance.svelte";
import Information from "./information.svelte";
import Login from "./login.svelte";
import Logout from "./logout.svelte";
import Scoreboard from "./scoreboard.svelte";
/** Internal window props */
export let id;
export let order;
let input = "";
const runnableApps = [
    {
        component: Email,
        id: "app-email",
        alias: ["snabela.exe", "snabel-a.exe"],
    },
    {
        component: Scoreboard,
        id: "app-scoreboard",
        alias: ["poengoversikt.exe"],
    },
    {
        component: Enhance,
        id: "app-enhance",
        alias: ["forbedre.exe", "forbedr.exe"],
    },
    {
        component: Information,
        id: "app-information",
        alias: ["informasjon.exe"],
    },
    {
        component: Logout,
        id: "app-logout",
        alias: ["logout.exe"],
    },
    {
        component: Login,
        id: "app-login",
        alias: ["login.exe"],
    },
];
function handleSubmit() {
    if (!input)
        return;
    if (input.toLowerCase() === "snø.exe") {
        snowing.set(true);
        apps.open({
            component: Alert,
            id: `${id}_alert`,
            parent: id,
            props: {
                severity: "success",
                message: `Snø har blitt startet i/på bakgrunnen.`,
                title: "snø.exe",
            },
        });
        return;
    }
    const appToRun = runnableApps.find((app) => app.alias.includes(input.toLowerCase()));
    if (appToRun) {
        apps.open(appToRun);
        apps.close(id);
    }
    else {
        apps.open({
            component: Alert,
            id: `${id}_alert`,
            parent: id,
            props: {
                severity: "warning",
                message: `DASS kan ikke finne '${input}'. Påse at du har skrevet navnet riktig og prøv på nytt.`,
                title: input,
            },
        });
    }
}
</script>

<Window
	windowTitle="Kjør"
	{id}
	{order}
	resizable={false}
	width={550}
	height={250}>
	<form slot="content" class="content" on:submit|preventDefault={handleSubmit}>
		<span>🚓</span>
		<p>
			Skriv navnet på et program, mappe, eller dokument, og DASS vil åpne det
			for deg.
		</p>
		<label for="application">Åpne:</label>
		<Cutout scrollable={false}>
			<input type="text" name="application" bind:value={input} />
		</Cutout>
		<div class="buttons">
			<Button type="submit" primary>OK</Button>
			<Button on:click={() => apps.close(id)}>Avbryt</Button>
		</div>
	</form>
</Window>

<style>
	form {
		display: grid;
		height: 100%;
		align-items: center;
		grid-template-rows: auto auto 1fr;
		grid-template-columns: 8ch 1fr;
		grid-template-areas: "icon text" "label input" "buttons buttons";
		row-gap: 10px;
	}

	span {
		font-size: 5ch;
	}

	.buttons {
		grid-area: buttons;
		align-self: end;
		display: flex;
		justify-content: flex-end;
	}

	.buttons :global(button) {
		min-width: 6rem;
		margin-left: 1rem;
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
