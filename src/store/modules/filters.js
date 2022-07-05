const state = {
  participantFilters: {},
  alertFilters: {}
};

const getters = {
  currentParticipantFilters: state => state.participantFilters,
  currentAlertFilters: state => state.alertFilters
};

const mutations = {
  setParticipantFilters(state, filters) {
    const rawFilters = { ...state.participantFilters, ...filters };
    state.participantFilters = Object.keys(rawFilters)
      .filter(k => rawFilters[k] != undefined)
      .reduce((obj, key) => {
        obj[key] = rawFilters[key];
        return obj;
      }, {});
  },
  setAlertFilters(state, filters) {
    state.alertFilters = { ...state.alertFilters, ...filters };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
