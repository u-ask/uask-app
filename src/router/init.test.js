import "../test-setup.js";
import test from "tape";
import store from "../store/index.js";
import { mapGetters, mapMutations } from "vuex";
import mapBind from "../mapbind.js";
import { setCurrentUser, initState } from "./init.js";

const {
  currentSurvey,
  currentParticipant,
  currentInterview,
  currentPage,
  currentUser,
  drivers,
  setProfile,
  setSurvey
} = mapBind(store, {
  ...mapGetters([
    "currentSurvey",
    "currentParticipant",
    "currentInterview",
    "currentPage",
    "currentUser",
    "drivers"
  ]),
  ...mapMutations("auth", ["setAcessToken", "setExpiresAt", "setProfile"]),
  ...mapMutations(["setSurvey"])
});

const adminToken = {
  iss: "Arone",
  iat: 1598948931,
  exp: 1630484931,
  aud: "www.arone.com",
  surveys: '{"P11-05":{"samples":["001"],"role":"administrator"}}'
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

test("Nothing to do", async t => {
  setProfile(adminToken);
  const route = await initState(
    { query: {}, params: { survey: "P11-05" }, matched: [] },
    { query: {}, params: { survey: "P11-05" }, matched: [] }
  );
  t.false(route);
  t.end();
});

test("Sync survey and participant", async t => {
  setProfile(adminToken);
  const survey = await drivers().surveyDriver.getByName("P11-05");
  setSurvey(survey);
  await initState(
    {
      query: {},
      params: { survey: "P11-05", participantCode: "000003" },
      matched: []
    },
    { query: {}, params: {}, matched: [] }
  );
  t.equal(currentSurvey().name, "P11-05");
  t.equal(currentParticipant().participantCode, "000003");
  t.end();
});

test("Interview and page query loading", async t => {
  setProfile(adminToken);
  const survey = await drivers().surveyDriver.getByName("P11-05");
  setSurvey(survey);
  await initState(
    {
      query: { interview: 3, page: 3 },
      params: { survey: "P11-05", participantCode: "000001" },
      matched: []
    },
    {
      query: { interview: 2, page: 2 },
      params: { survey: "P11-05", participantCode: "000001" },
      matched: []
    }
  );
  t.equal(currentInterview(), currentParticipant().interviews[2]);
  t.equal(currentPage().name.en, "Status");
  t.end();
});

test("Set the current User in state", async t => {
  setProfile(administratorToken);
  const survey = await drivers().surveyDriver.getByName("P11-05");
  setSurvey(survey);
  await setCurrentUser();
  const samples = await drivers().sampleDriver.getAll(survey);
  t.equal(currentUser().email, "administrator@example.com");
  t.equal(currentUser().firstName, "Geoffroy");
  t.equal(currentUser().name, "Belmont");
  t.equal(currentUser().phone, "0512345678");
  t.equal(currentUser().title, "Pr.");
  t.deepLooseEqual(
    currentUser().sampleCodes,
    samples.map(s => s.sampleCode)
  );
  t.end();
});
