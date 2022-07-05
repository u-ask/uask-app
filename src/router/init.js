import store from "../store/index.js";
import { mapGetters, mapMutations } from "vuex";
import mapBind from "../mapbind.js";
import { User } from "uask-dom";

const {
  currentSurvey,
  currentParticipant,
  currentInterview,
  currentPage,
  drivers,
  setSurvey,
  setParticipant,
  setInterview,
  setPage,
  setUser,
  role,
  givenName,
  surname,
  title,
  phone,
  email,
  email_verified,
  samples,
  participantIds,
  userid,
  id
} = mapBind(store, {
  ...mapGetters([
    "currentSurvey",
    "currentParticipant",
    "currentInterview",
    "currentPage",
    "drivers"
  ]),
  ...mapMutations([
    "setSurvey",
    "setParticipant",
    "setInterview",
    "setPage",
    "setUser"
  ]),
  ...mapGetters("auth", [
    "role",
    "givenName",
    "surname",
    "role",
    "workflow",
    "title",
    "phone",
    "email",
    "email_verified",
    "samples",
    "participantIds",
    "userid",
    "id"
  ])
});

export async function initState(to, from) {
  const params = await syncParams(
    comeBackFromAdmin(from, to) ? from.params : {},
    to.params,
    { to, from }
  );
  syncQuery(to.query);
  if (params) {
    return {
      name: to.name ?? "Home",
      params,
      query: to.query
    };
  }
}

function comeBackFromAdmin(from, to) {
  return (
    from.matched.some(m => m.name == "Admin") &&
    to.matched.every(m => m.name != "Admin")
  );
}

export function syncParams(from, to, routes) {
  return syncDiffParams(from, to, routes).then(needSync => {
    if (Object.keys(needSync).length > 0) {
      return setParams(to, needSync);
    }
  });
}

async function syncDiffParams(from, to, routes) {
  const needSync = {
    ...(await syncRootParams(from, to, routes)),
    ...(await syncParticipantParams(from, to, routes))
  };
  return needSync;
}

async function syncRootParams(from, to) {
  if (to.survey && to.survey != from.survey) {
    await syncSurvey(to.survey);
    await setCurrentUser();
  }
  return {};
}

async function syncParticipantParams(from, to, routes) {
  if (participantCreation(routes.from) && to.participantCode)
    return { participantCode: to.participantCode };
  const participantCode = await syncParticipant(to.participantCode);
  return participantForceChanged(participantCode, to)
    ? { participantCode }
    : {};
}

function participantCreation(from) {
  return from.participantCode == "create";
}

function participantForceChanged(participantCode, to) {
  return participantCode != to.participantCode;
}

async function syncSurvey(name) {
  const current = currentSurvey();
  if (current && name === current.name) return name;
  const survey = await getByName(name);
  setSurvey(survey);
  return survey?.name;
}

async function getByName(name) {
  return await drivers().surveyDriver.getByName(name);
}

function setParams(to, params) {
  return { ...to, ...params };
}

export function syncQuery(to) {
  const interviewIndex = to?.interview;
  const pageIndex = to?.page;
  const participant = currentParticipant();
  const interview = participant?.interviews[interviewIndex - 1];
  const page = interview?.pageSet.pages[pageIndex - 1];

  if (to.survey) {
    syncSurvey(to.survey);
  }

  if (interview && interview != currentInterview()) {
    setInterview(interview);
  }

  if (page && page != currentPage()) {
    setPage(page);
  }
}

function syncParticipant(id) {
  return syncParticipantState(id);
}

function syncParticipantState(id) {
  const participant = currentParticipant();
  if (id && (!participant || id != participant.participantCode))
    return initParticipant(id);
  return Promise.resolve(id);
}

async function initParticipant(id) {
  const samples = await drivers().sampleDriver.getAll(currentSurvey());
  const participant = await drivers().participantDriver.getByParticipantCode(
    currentSurvey(),
    samples,
    id
  );
  setParticipant(participant);
  return id;
}

export async function setCurrentUser() {
  const current = currentSurvey();

  if (current && samples()) {
    const allSamples = await drivers().sampleDriver.getAll(current);
    const samplesList =
      samples()[0] == "__all__"
        ? allSamples
        : samples().map(sampleCode =>
            allSamples.find(s => s.sampleCode == sampleCode)
          );
    const user = new User(
      surname(),
      givenName(),
      title(),
      role(),
      email(),
      phone(),
      samplesList,
      participantIds(),
      {
        userid: userid(),
        id: id(),
        email_verified: email_verified()
      }
    );
    setUser(user);
  }
}
