import { whoami } from "./api";
import { auth0Client } from "./auth0";
export async function authenticate() {
    const client = await auth0Client;
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await client.handleRedirectCallback();
        // TODO: Perhaps it's better to just remove the quary params
        window.history.replaceState({}, document.title, "/");
    }
    if (await client.isAuthenticated()) {
        await whoami();
        return true;
    }
    return false;
}
export async function login() {
    const client = await auth0Client;
    await client.loginWithRedirect({
        redirect_uri: window.location.origin,
    });
}
export async function logout() {
    const client = await auth0Client;
    client.logout({
        returnTo: window.location.origin,
    });
}
