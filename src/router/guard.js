import { verifyStateToken } from "./state.js";
import { failedLogin } from "./auth.js";
import { initState } from "./init.js";
import {
  callbackRedirect,
  loginRedirect,
  logoutRedirect,
  logoutCallbackRedirect,
  renewTokenCallback,
  userManager
} from "./oidc.js";

export function authentRedirect(to, from, next) {
  if (isAppPage(to)) {
    return appRedirect(to, from, next);
  }
  if (to.name == "Callback") {
    return callbackRedirect(to, from, next, userManager);
  }
  if (to.name == "CallbackLogout") {
    return logoutCallbackRedirect(to, from, next, userManager);
  }
  if (to.name == "CallbackRenew") {
    return renewTokenCallback(to, from, next, userManager);
  }
  if (to.name == "Login") {
    return loginRedirect(next);
  }
  if (to.name == "Logout") {
    return logoutRedirect(next);
  }
  return Promise.resolve(next());
}

function appRedirect(to, from, next) {
  return verifyStateToken(to)
    .then(next)
    .catch(failedLogin(to, from, next));
}

export async function startRedirect(to, from, next) {
  if (isAppPage(to)) {
    const start =
      to.name == "Home"
        ? {
            name: "Search participant",
            query: { ...to.query },
            params: { ...to.params }
          }
        : undefined;
    return next(start);
  }
  return next();
}

export function initRedirect(to, from, next) {
  if (isAppPage(to)) {
    return initState(to, from)
      .then(next)
      .catch(e => next({ name: "Error", query: { error: e } }));
  }
  return Promise.resolve(next());
}

function isAppPage(to) {
  return (
    to.name != "Error" &&
    to.name != "Login" &&
    to.name != "Logout" &&
    to.name != "Callback" &&
    to.name != "CallbackLogout" &&
    to.name != "CallbackRenew"
  );
}
