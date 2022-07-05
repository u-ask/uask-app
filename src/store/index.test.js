import "../test-setup.js";
import test from "tape";
import { DomainCollection, Interview, User } from "uask-dom";
import { mapActions, mapGetters, mapMutations } from "vuex";
import store from "./index.js";
import mapBind from "../mapbind.js";

const {
  currentParticipant,
  currentInterview,
  currentPageSet,
  currentPage,
  currentUser,
  currentWorkflow,
  currentErrors,
  drivers,
  setSurvey,
  setParticipant,
  setInterview,
  setPage,
  setUser,
  setError,
  clearErrors,
  saveParticipant,
  saveItems
} = mapBind(store, {
  ...mapGetters([
    "currentParticipant",
    "currentInterview",
    "currentPageSet",
    "currentPage",
    "currentUser",
    "currentWorkflow",
    "currentErrors",
    "drivers"
  ]),
  ...mapMutations([
    "setSurvey",
    "setParticipant",
    "setInterview",
    "setPageSet",
    "setPage",
    "setUser",
    "setError",
    "clearErrors"
  ]),
  ...mapActions(["saveParticipant", "saveItems"])
});

test("Participant saved", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  const samples = await drivers().sampleDriver.getAll(survey);
  const participant = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000002"
  );
  const sample = samples[1];
  const updated = participant.update({ sample });
  setSurvey(survey);
  await saveParticipant(updated);
  t.equal(currentParticipant().participantCode, "000002");
  const reloaded = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000002"
  );
  t.equal(reloaded.sample, sample);
  t.end();
});

test("Items saved", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  const samples = await drivers().sampleDriver.getAll(survey);
  const participant = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000001"
  );
  setSurvey(survey);
  setParticipant(participant);
  setPage(currentPageSet().pages[0]);
  const date = new Date();
  await saveItems([
    { pageItem: currentInterview().items[1].pageItem, value: date }
  ]);
  t.deepEqual(currentInterview().items[1].value, date);
  t.equal(currentPage(), currentPageSet().pages[0]);
  const reloaded = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000001"
  );
  t.deepEqual(
    reloaded.currentInterview(survey.mainWorkflow).items[1].value,
    date
  );
  t.end();
});

test("Interview saved", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  const samples = await drivers().sampleDriver.getAll(survey);
  const participant = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000008"
  );
  setSurvey(survey);
  setParticipant(participant);
  const interview = new Interview(currentPageSet(), {});
  const updatedParticipant = participant.update({
    interviews: DomainCollection(interview)
  });
  await saveParticipant(updatedParticipant);
  t.equal(currentParticipant().interviews[0].pageSet, interview.pageSet);
  const reloaded = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000008"
  );
  t.equal(reloaded.interviews.length, 1);
  t.end();
});

test("New interview saved", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  const samples = await drivers().sampleDriver.getAll(survey);
  const participant = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000004"
  );
  setSurvey(survey);
  setParticipant(participant);
  const date = new Date();
  await saveItems([
    { pageItem: currentPageSet().pages[0].items[1], value: date }
  ]);
  t.deepEqual(currentInterview().items[1].value, date);
  t.end();
});

test("State interview consistency", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  const samples = await drivers().sampleDriver.getAll(survey);
  const participant = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000001"
  );
  setSurvey(survey);
  setParticipant(participant);
  const interview = participant.currentInterview(survey.mainWorkflow);
  t.equal(currentInterview(), interview);
  t.equal(currentPageSet(), interview.pageSet);
  t.equal(currentPage(), interview.currentPage);
  t.end();
});

test("State interview consistency", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  const samples = await drivers().sampleDriver.getAll(survey);
  const participant = await drivers().participantDriver.getByParticipantCode(
    survey,
    samples,
    "000001"
  );
  setSurvey(survey);
  setParticipant(participant);
  setInterview(participant.interviews[0]);
  t.equal(currentInterview(), participant.interviews[0]);
  t.equal(currentPageSet(), participant.interviews[0].pageSet);
  t.end();
});

test("Current user informations", async t => {
  const survey = await drivers().surveyDriver.getByName("P11-05");
  setSurvey(survey);
  const user = new User("me", "and me", "and me again", "participant", "me@me.me");
  setUser(user);
  t.equal(currentUser(), user);
  t.equal(currentWorkflow(), survey.workflow("participant"));
  t.end();
});

test("setError in state", async t => {
  const error = {
    statusCode: 400,
    messages: "Bad Request"
  };
  setError(error);
  t.equal(currentErrors()[0], error);
  clearErrors();
  t.equal(currentErrors().length, 0);
  t.end();
});
