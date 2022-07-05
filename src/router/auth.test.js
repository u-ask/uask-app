import "../test-setup.js";
import test from "tape";

import { failedLogin } from "./auth.js";

const validRoute = {
  path: "/valid",
  query: {},
  params: {}
};

const otherRoute = {
  path: "/other",
  query: {},
  params: {}
};

test("Redirects to callback with redirect_uri and state", async t => {
  const next = to => {
    t.equal(to.name, "Callback");
    t.equal(to.query.state, "iamthestate");
  };
  failedLogin(validRoute, otherRoute, next)({ state: "iamthestate" });
  t.end();
});

test("Redirects to login with context", async t => {
  const next = to => {
    t.equal(to.query.survey, "P11-05");
    t.equal(to.query.participantCode, "000003");
  };
  failedLogin(
    {
      query: {},
      params: { survey: "P11-05", participantCode: "000003" }
    },
    otherRoute,
    next
  )();
  t.end();
});
