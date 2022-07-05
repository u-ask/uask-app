import test from "tape";
import store from "../index.js";
import { mapGetters, mapMutations } from "vuex";
import mapBind from "../../mapbind.js";
import { Survey } from "uask-dom";

const {
  clearAccessToken,
  setProfile,
  setExpiresAt,
  isLoggedIn,
  isTokenExpired,
  givenName,
  surname,
  role,
  email,
  phone,
  samples,
  title,
  isInRole,
  setSurvey
} = mapBind(store, {
  ...mapMutations("auth", ["clearAccessToken", "setProfile", "setExpiresAt"]),
  ...mapGetters("auth", [
    "isLoggedIn",
    "isTokenExpired",
    "givenName",
    "surname",
    "role",
    "email",
    "phone",
    "samples",
    "title",
    "isInRole"
  ]),
  ...mapMutations(["setSurvey"])
});

setSurvey(new Survey("P11-05"));

const adminToken = {
  iss: "Arone",
  iat: 1598948931,
  exp: 4094488800,
  aud: "www.arone.com",
  surveys: '{"P11-05":{"samples":["001"],"role":"administrator"}}',
  surname: "H",
  given_name: "I"
};

const administratorToken = {
  sub: "23121d3c-84df-44ac-b458-3d63a9a05497",
  email: "administrator@example.com",
  email_verified: true,
  surveys: '{"P11-05":{"samples":["001","002"],"role":"administrator"}}',
  given_name: "Geoffroy",
  surname: "Belmont",
  phone: "0512345678",
  title: "Pr.",
  nonce: "42bb9c8a9202441f8cf46a42bcc69414",
  s_hash: "XAG909zOhG1KfN7eMRtGcA",
  aud: "spiral",
  exp: 2531573339,
  iat: 1612545355,
  iss: "http://localhost",
  jti: "1d3d2962-6586-46b8-ab9b-31483be87d4f"
};

test("No token", t => {
  clearAccessToken();
  t.false(isLoggedIn());
  t.true(isTokenExpired());
  t.end();
});

test("State set valid token", t => {
  setProfile(adminToken);
  setExpiresAt(Date.now() / 1000 + 50);
  t.true(isLoggedIn());
  t.false(isTokenExpired());
  t.true(givenName());
  t.true(surname());
  t.equal(role(), "administrator");
  t.true(isInRole()("administrator", "participant"));
  t.end();
});

test("User state informations", t => {
  setProfile(administratorToken);
  setExpiresAt(Date.now() / 1000 + 50);
  t.true(isLoggedIn());
  t.false(isTokenExpired());
  t.equal(email(), "administrator@example.com");
  t.equal(role(), "administrator");
  t.equal(givenName(), "Geoffroy");
  t.equal(surname(), "Belmont");
  t.equal(phone(), "0512345678");
  t.deepLooseEqual(samples(), ["001", "002"]);
  t.equal(title(), "Pr.");
  t.end();
});
