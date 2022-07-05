import Vue from "vue";
import Vuex from "vuex";
import studio from "./modules/studio.js";
import auth from "./modules/auth.js";
import navigation from "./modules/navigation.js";
import themeConfig from "./modules/themeConfig.js";
import filters from "./modules/filters.js";
import { InterviewBuilder, ParticipantBuilder } from "uask-dom";
import { UaskClientError } from "uask-sys";
import { Driver } from "./drivers.js";

Vue.use(Vuex);

const store = {
  state: {
    currentSurvey: undefined,
    currentPageSet: undefined,
    currentPage: undefined,
    currentParticipant: undefined,
    currentInterview: undefined,
    currentUser: undefined,
    currentWorkflow: undefined,
    currentErrors: []
  },
  getters: {
    currentSurvey: state => state.currentSurvey,
    currentPageSet: state => state.currentPageSet,
    currentPage: state => state.currentPage,
    currentParticipant: state => state.currentParticipant,
    currentInterview: state => state.currentInterview,
    currentUser: state => state.currentUser,
    currentErrors: state => state.currentErrors,
    currentWorkflow: state => state.currentWorkflow,
    drivers: (state, getters, rootState) =>
      Driver.build(rootState.auth.accessToken, rootState.studio.isStudioMode)
  },
  mutations: {
    setSurvey(state, survey) {
      const name = state.currentSurvey?.name;
      state.currentSurvey = survey;
      if (survey.name != name) {
        this.commit("setPageSet", survey.pageSets[0]);
        this.commit("setParticipant", undefined);
      }
      if (state.currentUser)
        this.commit("setWorkflow", survey.workflow(state.currentUser));
      else this.commit("setWorkflow", survey.mainWorkflow);
    },
    setWorkflow(state, workflow) {
      state.currentWorkflow = workflow;
    },
    setPageSet(state, pageSet) {
      if (state.currentPageSet != pageSet) {
        state.currentPageSet = pageSet;
        if (!pageSet.pages.includes(state.currentPage)) {
          this.commit("setPage", pageSet.pages[0]);
        }
      }
    },
    setPage(state, page) {
      state.currentPage = page;
    },
    setParticipant(state, participant) {
      const participantCode = state.currentParticipant?.participantCode;
      state.currentParticipant = participant;
      if (participant?.participantCode != participantCode) {
        const workflow = state.currentWorkflow;
        this.commit("setInterview", participant?.currentInterview(workflow));
      }
    },
    setInterview(state, interview) {
      if (state.currentInterview != interview) {
        const nonce = state.currentInterview?.nonce ?? -1;
        state.currentInterview = interview;
        if (interview && nonce != 0 && interview.nonce != nonce) {
          this.commit(
            "setPageSet",
            interview?.pageSet ?? state.currentSurvey.pageSets[0]
          );
          if (interview.nonce != nonce && interview.pageSet.pages.length > 0)
            this.commit(
              "setPage",
              interview?.currentPage ??
                interview?.pageSet.pages[0] ??
                state.currentSurvey.pageSets[0].pages[0]
            );
          else this.commit("setPage", undefined);
        }
      }
    },
    setUser(state, user) {
      state.currentUser = user;
      this.commit("setWorkflow", state.currentSurvey.workflow(user));
    },
    setError(state, error) {
      state.currentErrors.push(error);
    },
    clearErrors(state) {
      state.currentErrors = [];
    }
  },
  actions: {
    saveParticipant(store, participant) {
      return saveParticipantAsync(store, participant).catch(e =>
        handleStateError(store, e)
      );
    },
    saveItems(store, items) {
      return saveItemsAsync(store, items).catch(e =>
        handleStateError(store, e)
      );
    },
    deleteParticipant(store, participant) {
      return deleteParticipantAsync(store, participant).catch(e =>
        handleStateError(store, e)
      );
    },
    deleteInterview(store, interview) {
      return deleteInterviewAsync(store, interview).catch(e =>
        handleStateError(store, e)
      );
    }
  },
  modules: {
    filters,
    auth,
    studio,
    navigation,
    themeConfig
  }
};

export default new Vuex.Store(store);

async function saveParticipantAsync({ state, commit, getters }, participant) {
  const participantKeys = await getters.drivers.participantDriver.save(
    state.currentSurvey,
    participant
  );
  const newParticipant = participant.update(participantKeys);
  const newInterviews = [];
  for (const i of participant.interviews) {
    const interviewKeys = await getters.drivers.interviewDriver.save(
      state.currentSurvey,
      newParticipant,
      i
    );
    const updated = i.update(interviewKeys);
    newInterviews.push(updated);
  }
  const updatedParticipant = newParticipant.update({
    interviews: newInterviews
  });

  commit("setParticipant", updatedParticipant);
  commit("setInterview", newInterviews[newInterviews.length - 1]);
}

async function deleteParticipantAsync({ state, commit, getters }, participant) {
  await getters.drivers.participantDriver.delete(
    state.currentSurvey,
    participant
  );
  commit("setParticipant", undefined);
}

function saveItemsAsync({ state, commit, getters }, items) {
  const { builder, outer } = prepareBuild(state);
  for (const item of items) builder.item(item);
  const interview = builder.build(outer);
  return saveInterviewAsync({ state, commit, getters }, interview);
}

function saveInterviewAsync({ state, commit, getters }, interview) {
  return getters.drivers.interviewDriver
    .save(state.currentSurvey, state.currentParticipant, interview)
    .then(interviewKeys => {
      const newInterview = interview.update(interviewKeys);
      const participant = new ParticipantBuilder(
        state.currentSurvey,
        state.currentParticipant
      )
        .interview(newInterview)
        .build();

      commit("setParticipant", participant);
      commit("setInterview", newInterview);
    });
}

async function deleteInterviewAsync({ state, commit, getters }, interview) {
  await getters.drivers.interviewDriver.delete(
    state.currentSurvey,
    state.currentParticipant,
    interview
  );
  const newParticipant = state.currentParticipant.update({
    interviews: state.currentParticipant.interviews.delete(
      i => i.nonce == interview.nonce
    )
  });
  commit("setParticipant", newParticipant);
  commit("setInterview", newParticipant.interviews[0]);
}

function prepareBuild(state) {
  const builder = new InterviewBuilder(
    state.currentSurvey,
    state.currentInterview ?? state.currentPageSet
  );
  const currentIndex = state.currentParticipant.interviews.findIndex(
    i => i.nonce == state.currentInterview?.nonce
  );
  const outer =
    currentIndex > -1
      ? state.currentParticipant.interviews.slice(0, currentIndex)
      : state.currentParticipant.interviews;
  return { builder, outer };
}

function handleStateError({ commit }, error) {
  if (Array.isArray(error)) error.forEach(setError);
  else setError(error);
  return Promise.reject(error);

  function setError(err) {
    if (err instanceof UaskClientError) commit("setError", err);
  }
}
