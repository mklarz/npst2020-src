import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import App from "./app.svelte";
const app = new App({ target: document.body });
Sentry.init({
    dsn: "https://af55d42a29c942129bac17eb67b57c3d@o483471.ingest.sentry.io/5535240",
    integrations: [new Integrations.BrowserTracing()],
    release: "git@" + process.env.COMMIT_REF,
    enabled: window.location.href.indexOf("localhost") === -1,
    environment: process.env.CONTEXT,
    tracesSampleRate: 1.0,
});
export default app;
