import createAuth0Client from "@auth0/auth0-spa-js";
const AUTH0_CONFIG = {
    client_id: process.env.AUTH_CLIENT_ID || "",
    domain: process.env.AUTH_DOMAIN || "",
    audience: process.env.AUTH_AUDIENCE,
    cacheLocation: "localstorage",
    advancedOptions: {
        defaultScope: "openid",
    },
};
export const auth0Client = createAuth0Client(AUTH0_CONFIG);
