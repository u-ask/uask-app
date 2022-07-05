const state = function() {
  return {
    currentItem: undefined,
    isStudioMode: false,
    pendingStudioModification: false,
    unfoldedItem: undefined
  };
};

const getters = {
  isStudioMode: function(state) {
    return state.isStudioMode;
  },
  pendingStudioModification: function(state) {
    return state.pendingStudioModification;
  },
  unfoldedItem: function(state) {
    return state.unfoldedItem;
  },
  currentItem: function(state) {
    return state.currentItem;
  }
};

const mutations = {
  setItem(state, value) {
    state.currentItem = value;
  },
  setPendingStudioModification(state, value) {
    state.pendingStudioModification = value;
  },
  setStudioMode(state, value) {
    state.isStudioMode = value;
  },
  setUnfoldedItem(state, value) {
    state.unfoldedItem = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
