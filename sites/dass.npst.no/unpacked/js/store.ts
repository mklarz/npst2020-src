import { writable, readable } from "svelte/store";
import * as Sentry from "@sentry/browser";
import { fetchMessages } from "./utils/api";
export const kernelPanic = writable("");
export const user = writable(null);
export const snowing = writable(false);
function getSystemTime() {
    const now = new Date().getTime();
    const twentyFourMinutes = 24 * 60 * 1000;
    return now - twentyFourMinutes;
}
function getUserTime() {
    const offset = 1000 * +(localStorage.getItem("clockOffset") || 0) || 0;
    return getSystemTime() + offset;
}
function getTime() {
    const system = new Date(getSystemTime());
    const user = new Date(getUserTime());
    return { system, user };
}
export const clock = readable(getTime(), function start(set) {
    const interval = setInterval(() => {
        set(getTime());
    }, 1000);
    return function stop() {
        clearInterval(interval);
    };
});
function focusApplication(appList, idToFocus) {
    // Find the app by index
    const appIndex = appList.findIndex((a) => a.id === idToFocus);
    // If it doesn't exist, ruten an unmodified app list
    if (appIndex === -1)
        return appList;
    // Put the app in focus
    let newAppList = [
        ...appList.slice(0, appIndex),
        ...appList.slice(appIndex + 1),
        appList[appIndex],
    ];
    // Get all children of the app
    const children = appList.filter((a) => a.parent === idToFocus);
    // Focus all children recursivly
    for (let child of children) {
        newAppList = focusApplication(newAppList, child.id);
    }
    return newAppList;
}
function createApps() {
    const { subscribe, set, update } = writable([]);
    return {
        subscribe,
        focus: (id) => update((list) => focusApplication(list, id)),
        open: (app) => {
            update((list) => {
                const appIndex = list.findIndex((a) => a.id === app.id);
                // If it's a new app, add it to the list
                if (appIndex === -1) {
                    let pos = [0, 0];
                    // Use parent position if it has a parent
                    if (app.parent) {
                        const parent = list.find((a) => a.id === app.parent);
                        if (parent) {
                            pos = [parent.pos[0] + 50, parent.pos[1] + 50];
                        }
                    }
                    return [...list, Object.assign(Object.assign({}, app), { pos })];
                }
                // Otherwhise, put focus the app window
                return focusApplication(list, list[appIndex].id);
            });
        },
        close: (id) => update((list) => list.filter((a) => a.id !== id)),
        closeAll: () => set([]),
    };
}
function createMessageStore() {
    const { subscribe, set, update } = writable({ state: "INITIAL" });
    return {
        subscribe,
        async lookForNewMessages() {
            try {
                let alreadyWorking = false;
                update((current) => {
                    if (current.state === "LOADING") {
                        alreadyWorking = true;
                        return current;
                    }
                    return Object.assign(Object.assign({}, current), { state: "LOADING" });
                });
                if (alreadyWorking)
                    return;
                const data = await fetchMessages();
                if (data === null) {
                    update((current) => (Object.assign(Object.assign({}, current), { state: "ERROR" })));
                }
                else {
                    set({ state: "DONE", data });
                }
            }
            catch (err) {
                Sentry.captureException(err);
                update((current) => (Object.assign(Object.assign({}, current), { state: "ERROR" })));
            }
        },
    };
}
function createLoadingStore() {
    const { subscribe, set } = writable(false);
    return {
        subscribe,
        waitForPromise: async (promise) => {
            set(true);
            await promise;
            set(false);
        },
        wait: async (milliseconds) => {
            set(true);
            setTimeout(() => set(false), milliseconds);
        },
    };
}
function createBackgroundStore() {
    const KEY = "@@background";
    const { subscribe, set } = writable(localStorage.getItem(KEY));
    return {
        subscribe,
        set(background) {
            localStorage.setItem(KEY, background || "");
            set(background);
        },
    };
}
function createServicePackStore() {
    const key = "@@servicepack";
    let sp = parseInt(localStorage.getItem(key) || "0", 10);
    if (isNaN(sp)) {
        localStorage.setItem(key, "0");
        sp = 0;
    }
    const { subscribe, set } = writable(sp);
    return {
        subscribe,
        update: (newSP) => {
            localStorage.setItem(key, newSP.toString());
            set(newSP);
        },
    };
}
export const apps = createApps();
export const messages = createMessageStore();
export const loading = createLoadingStore();
export const background = createBackgroundStore();
export const servicePack = createServicePackStore();
