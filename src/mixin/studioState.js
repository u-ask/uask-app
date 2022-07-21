import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      canApply: true
    };
  },
  computed: {
    ...mapGetters("studio", ["isStudioMode", "showInvisibleItems"]),
    pageIndex() {
      return this.currentSurvey.pages.indexOf(this.currentPage);
    },
    pageSetIndex() {
      return this.currentSurvey.pageSets.indexOf(this.currentPageSet);
    }
  },
  methods: {
    ...mapMutations("studio", [
      "setItem",
      "setStudioMode",
      "setShowInvisibleItems"
    ]),
    studiostate() {
      return this.currentParticipant.getState(this.currentInterview);
    },
    setState(state) {
      this.setInterview(state.interview);
      this.setPageSet(state.pageSet);
      this.setPage(state.page);
      if (state.result) this.setItem(undefined);
      else this.setItem(state.pageItem);
      this.setWorkflow(this.currentSurvey.workflow(this.currentUser));
    },
    start(getCommand, onStarted = s => this.setState(s)) {
      this.setPendingStudioModification(true);
      const state = this.studiostate();
      const started = getCommand(state)
        .then(s => {
          this.setState(s);
          return s;
        })
        .finally(() => {
          this.setPendingStudioModification(false);
          this.setUnfoldedItem(undefined);
        });
      onStarted(state);
      return { state, started };
    },
    cancel() {
      this.studiostate().cancel();
    }
  },
  watch: {
    currentInterview(val) {
      if (this.isStudioMode)
        this.canApply = this.studiostate().canApply(val.items);
    }
  },
  mounted() {
    if (this.isStudioMode)
      this.canApply = this.studiostate().canApply(this.currentInterview.items);
  }
};
