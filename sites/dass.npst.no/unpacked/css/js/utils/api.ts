import * as Sentry from "@sentry/browser";
import { auth0Client } from "./auth0";
import { user } from "../store";
async function getAuthHeaders() {
    const client = await auth0Client;
    const token = await client.getTokenSilently();
    return { Authorization: `Bearer ${token}` };
}
export async function whoami() {
    const headers = await getAuthHeaders();
    const res = await fetch("/.netlify/functions/profile", { headers });
    if (res.ok) {
        const thisIsMe = (await res.json());
        user.set(thisIsMe);
        Sentry.setUser({
            username: thisIsMe === null || thisIsMe === void 0 ? void 0 : thisIsMe.display_name,
            id: thisIsMe === null || thisIsMe === void 0 ? void 0 : thisIsMe.id,
        });
        return thisIsMe;
    }
    return null;
}
export async function whoiam(edited) {
    const headers = await getAuthHeaders();
    const res = await fetch("/.netlify/functions/profile", {
        method: "POST",
        headers: Object.assign(Object.assign({}, headers), { Accept: "application/json", "Content-Type": "application/json" }),
        body: JSON.stringify(edited),
    });
    if (res.ok) {
        const thisIsMeNow = (await res.json());
        user.set(thisIsMeNow);
        Sentry.setUser({
            username: thisIsMeNow === null || thisIsMeNow === void 0 ? void 0 : thisIsMeNow.display_name,
            id: thisIsMeNow === null || thisIsMeNow === void 0 ? void 0 : thisIsMeNow.id,
        });
        return;
    }
    else if (res.status === 400) {
        throw await res.json();
    }
    throw { code: 0, message: "Noe gikk galt." };
}
export async function scoreboard() {
    const res = await fetch("/.netlify/functions/scoreboard");
    if (res.ok) {
        return (await res.json());
    }
    return null;
}
export async function fetchMessages() {
    const headers = await getAuthHeaders();
    const res = await fetch("/.netlify/functions/messages" + window.location.search, { headers });
    if (res.ok) {
        return (await res.json());
    }
    return null;
}
export async function submit(message) {
    const headers = await getAuthHeaders();
    const res = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: Object.assign(Object.assign({}, headers), { Accept: "application/json", "Content-Type": "application/json" }),
        body: JSON.stringify(message),
    });
    if (res.ok) {
        return await res.json();
    }
    else if (res.status === 400) {
        throw await res.json();
    }
    throw { code: 0, message: "Noe gikk galt." };
}
