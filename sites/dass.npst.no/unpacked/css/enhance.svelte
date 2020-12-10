<script lang="ts">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Sentry from "@sentry/browser";
import SparkMD5 from "spark-md5";
import Button from "../components/button.svelte";
import Cutout from "../components/cutout.svelte";
import Window from "../components/window.svelte";
;
import { apps } from "../store";
import Alert from "./alert.svelte";
/** Internal window props */
export let id;
export let order;
let fileInput;
let url = "";
let newUrl = "";
let show = false;
let isSubmitting = false;
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => reject();
        image.src = url;
    });
}
function handleSelectFile(e) {
    url && URL.revokeObjectURL(url);
    const image = (e.currentTarget.files || [])[0];
    url = image ? URL.createObjectURL(image) : "";
}
function handleSubmit() {
    return __awaiter(this, void 0, void 0, function* () {
        if (url === "" || isSubmitting)
            return;
        isSubmitting = true;
        const hash = yield fetch(url)
            .then((res) => res.arrayBuffer())
            .then((buf) => SparkMD5.ArrayBuffer.hash(buf))
            .catch((err) => {
            Sentry.captureException(err);
            apps.open({
                id: `${id}_alert`,
                parent: id,
                component: Alert,
                props: {
                    title: "Forbedring feilet",
                    message: "Aiai, her skjedde det noe krøll!",
                    severity: "error",
                },
            });
            return null;
        });
        if (hash === null)
            return;
        try {
            yield preloadImage(`/images/${hash}.png`);
            newUrl = `/images/${hash}.png`;
            show = true;
            yield new Promise((resolve) => setTimeout(resolve, 1100));
            url = newUrl;
            // prevent flash
            yield new Promise((resolve) => setTimeout(resolve, 100));
            show = false;
        }
        catch (_a) {
            apps.open({
                id: `${id}_alert`,
                parent: id,
                component: Alert,
                props: {
                    title: "Forbedring feilet",
                    message: "Greide ikke forbedre bildet. Trolig er dette så bra bildet blir.",
                    severity: "info",
                },
            });
        }
        isSubmitting = false;
    });
}
</script>

<Window windowTitle="Forbedre" {id} {order} width={600} height={520}>
	<form slot="content" on:submit|preventDefault={handleSubmit}>
		<Button on:click={() => fileInput.click()}>Velg bilde...</Button>
		<input
			bind:this={fileInput}
			hidden
			type="file"
			accept="image/*"
			name="image"
			on:change={handleSelectFile} />
		<Cutout>
			<div
				class:show
				id="new"
				style="background: center / contain no-repeat url('{newUrl}')" />
			<div style="background: center / contain no-repeat url('{url}')" />
		</Cutout>
		<Button type="submit" disabled={isSubmitting} primary>Forbedr</Button>
	</form>
</Window>

<style>
	form {
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100%;
		row-gap: 1rem;
	}

	div {
		position: absolute;
		left: 2px;
		top: 2px;
		right: 2px;
		bottom: 2px;
	}

	div#new {
		z-index: 1;
		opacity: 0;
		visibility: hidden;
		-webkit-transition: opacity 1s ease-in-out;
		-moz-transition: opacity 1s ease-in-out;
		-ms-transition: opacity 1s ease-in-out;
		-o-transition: opacity 1s ease-in-out;
		transition: opacity 1s ease-in-out;
	}

	div#new.show {
		opacity: 1;
		visibility: visible;
	}
</style>
