import Cookies from "js-cookie";
import { UserManager } from "oidc-client-ts";
import { clearStateToken, setStateToken } from "./state.js";

const oidcSettings = {
  authority: `${process.env.VUE_APP_AUTH_URL}`,
  client_id: "uask",
  response_type: "code",
  scope: "openid email profile",
  redirect_uri: `${process.env.VUE_APP_CB_ROOT_URL}`,
  post_logout_redirect_uri: `${process.env.VUE_APP_CB_ROOT_URL}-logout`,
  silent_redirect_uri: `${process.env.VUE_APP_CB_ROOT_URL}-renew`,
  silentRequestTimeoutInSeconds: 30,
  loadUserInfo: true
};

export const userManager = new UserManager(oidcSettings);

export function callbackRedirect(to, from, next, userManager) {
  if (to.query.redirect_uri) return startLogin(to, from, next, userManager);
  else return endLogin(to, from, next, userManager);
}

export function logoutRedirect(next) {
  Cookies.remove("_uaskDemo");
  return next();
}

export function logoutCallbackRedirect(to, from, next, userManager) {
  if (to.query.start) startLogout(to, from, next, userManager);
  else return endLogout(to, from, next, userManager);
}

export function loginRedirect(next) {
  return next();
}

function startLogin(to, from, next, userManager) {
  const extraQueryParams = isDemo(to)
    ? { method: "demo" }
    : isMagic(to)
    ? {
        method: "magic",
        magic: to.query.magic,
        prompt: "login"
      }
    : {};
  return userManager.signinRedirect({ extraQueryParams });
}

function endLogin(to, from, next, userManager) {
  return userManager
    .signinRedirectCallback(to.fullPath)
    .then(user => setStateToken(user))
    .then(next)
    .catch(e => next({ name: "Error", query: { error: e } }));
}

function startLogout(to, from, next, userManager) {
  return clearStateToken().then(() => {
    localStorage.setItem(
      "uaskLogoutRedirect",
      JSON.stringify({ ...to.query, name: from.name })
    );
    userManager.signoutRedirect();
  });
}

function endLogout(to, from, next, userManager) {
  return userManager.signoutRedirectCallback().then(() => {
    const params = JSON.parse(localStorage.getItem("uaskLogoutRedirect"));
    const redirect = {
      name: params.survey ? "Home" : params.name,
      params: params
    };
    next(redirect);
  });
}

export function timeoutRenewToken(expires_in) {
  setTimeout(() => startRenewToken(), expires_in * 1000 - 60000);
}

function startRenewToken() {
  userManager
    .signinSilent()
    .then(user => setStateToken(user))
    .catch(err => console.error(err));
}

export function renewTokenCallback(to, from, next, userManager) {
  return userManager.signinSilentCallback().catch(err => console.error(err));
}

function isDemo(to) {
  return to.query.survey == "Demo-Stats" || to.query.survey == "Demo-eCRF";
}

function isMagic(to) {
  return typeof to.query.magic != "undefined";
}

export function makeHash(token, state) {
  return `#id_token=${token}&state=${state}`;
}

export function splitHash(hash) {
  return hash
    .substring(1)
    .split("&")
    .map(h => h.split("="))
    .reduce((a, h) => {
      a[h[0]] = h[1];
      return a;
    }, {});
}
