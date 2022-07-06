const state = function() {
  return {
    accessToken: undefined,
    expiresAt: undefined,
    profile: undefined
  };
};

const getters = {
  tokenExpiration: function(state) {
    if (!state.expiresAt) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(state.expiresAt);
    return date;
  },

  surname: function(state) {
    return state.profile["surname"];
  },

  givenName: function(state) {
    return state.profile["given_name"];
  },

  role: function(state, getters, rootState) {
    const surveyName = rootState.currentSurvey?.name;
    return surveyProps(state, surveyName)?.role?.split(":")?.[0];
  },

  workflow: function(state, getters, rootState) {
    const surveyName = rootState.currentSurvey?.name;
    return surveyProps(state, surveyName)?.role;
  },

  title: function(state) {
    return state.profile["title"];
  },

  phone: function(state) {
    return state.profile["phone"];
  },

  email: function(state) {
    return state.profile["email"];
  },

  userid: function(state) {
    return state.profile["userid"];
  },

  id: function(state) {
    return state.profile["sub"];
  },

  email_verified: function(state) {
    return state.profile["email_verified"];
  },

  samples: function(state, getters, rootState) {
    const surveyName = rootState.currentSurvey?.name;
    return surveyProps(state, surveyName)?.samples;
  },

  participantCodes: function(state, getters, rootState) {
    const surveyName = rootState.currentSurvey?.name;
    return surveyProps(state, surveyName)?.participantCodes;
  },

  surveys: function(state) {
    return state.profile["surveys"];
  },

  /**
   * This getter returns an receive on ore more roles and return true if the connected user has one of those roles.
   */
  isInRole: function(state, getters) {
    return (...roles) => roles.includes(getters.role);
  },

  isTokenExpired: function(state, getters) {
    return getters.tokenExpiration < new Date();
  },

  isLoggedIn: function(state, getters) {
    if (!state.profile) return false;
    return !getters.isIdTokenExpired;
  }
};

const mutations = {
  setProfile: function(state, profile) {
    state.profile = profile;
  },
  setAccessToken: function(state, accessToken) {
    state.accessToken = accessToken;
  },
  setExpiresAt: function(state, expiresAt) {
    state.expiresAt = expiresAt;
  },
  clearAccessToken: function() {
    this.commit("auth/setProfile", "");
    this.commit("auth/setAccessToken", "");
    this.commit("auth/setExpiresAt", "");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};

function surveyProps({ profile }, surveyName) {
  if (!profile["surveys"] || !surveyName) return undefined;
  return typeof profile["surveys"] == "string"
    ? JSON.parse(profile["surveys"])[surveyName]
    : profile["surveys"][surveyName];
}
