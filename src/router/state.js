import store from "../store/index.js";
import { mapGetters, mapMutations } from "vuex";
import mapBind from "../mapbind.js";
import crypto from "crypto";
import { timeoutRenewToken } from "./oidc.js";

const {
  isLoggedIn,
  clearAccessToken,
  setAccessToken,
  setExpiresAt,
  setProfile
} = mapBind(store, {
  ...mapGetters("auth", ["isLoggedIn"]),
  ...mapMutations("auth", [
    "clearAccessToken",
    "setAccessToken",
    "setExpiresAt",
    "setProfile"
  ])
});

export async function clearStateToken() {
  clearAccessToken();
}

export function verifyStateToken() {
  if (isLoggedIn()) return Promise.resolve();
  const state = generateState();
  return Promise.reject({ state });
}

export function setStateToken({
  access_token,
  expires_at,
  expires_in,
  profile
}) {
  setAccessToken(access_token);
  setExpiresAt(expires_at);
  setProfile(profile);
  timeoutRenewToken(expires_in);
  const to = JSON.parse(localStorage.getItem("uaskRedirectCallback"));
  return to;
}

function generateState() {
  const arr = [...crypto.randomBytes(20)];
  return arr
    .map(b => b.toString(35))
    .join("")
    .substring(0, 32);
}
