import {
  ParticipantAuthorizationManager,
  SurveyAuthorizationManager
} from "uask-sys";
import { mapGetters, mapMutations, mapActions } from "vuex";

const { pushSave, cancelSave, resumeSave, delaySave } = (function() {
  let savePending = Promise.resolve();
  let delayAction = () => {};
  const __canceled__ = { __canceled__: true };
  const __continue__ = { __canceled__: false };

  return {
    pushSave(save, onSaved) {
      const result = savePending.then(s =>
        s == __canceled__ ? __canceled__ : save()
      );
      savePending = result.catch(e => {
        console.error(e);
      });
      return result.then(s => (s == __canceled__ ? __canceled__ : onSaved?.()));
    },
    cancelSave(onCanceled = () => __canceled__) {
      delayAction(__canceled__);
      return savePending.then(r => (r == __canceled__ ? onCanceled?.() : r));
    },
    resumeSave() {
      delayAction(__continue__);
      return savePending;
    },
    delaySave(
      delay,
      onExpired = () => __continue__,
      onCanceled = () => __canceled__
    ) {
      const cancelable = new Promise(r => {
        delayAction = action => {
          r(action);
        };
      });
      const delayed = new Promise(r => {
        setTimeout(() => {
          r(__continue__);
        }, delay);
      });

      savePending = savePending.then(() => Promise.race([cancelable, delayed]));
      return savePending.then(r => {
        return r == __canceled__ ? onCanceled() : onExpired();
      });
    }
  };
})();

export default {
  computed: {
    ...mapGetters([
      "currentSurvey",
      "currentParticipant",
      "currentInterview",
      "currentPageSet",
      "currentPage",
      "currentUser",
      "currentWorkflow",
      "currentErrors",
      "drivers"
    ]),
    availableInterviews() {
      return this.currentParticipant.availableInterviews(this.currentWorkflow);
    },
    availablePageSets() {
      return this.currentParticipant.availablePageSets(this.currentWorkflow);
    },
    authorizationManager() {
      const pautz = new ParticipantAuthorizationManager(
        this.currentSurvey,
        this.currentParticipant,
        this.currentUser
      );
      const sautz = new SurveyAuthorizationManager(
        this.currentSurvey,
        this.currentUser
      );
      return new Proxy(
        {},
        {
          get: (target, p, receiver) =>
            Reflect.get(pautz, p, receiver) ?? Reflect.get(sautz, p, receiver)
        }
      );
    },
    mobile() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  methods: {
    ...mapMutations([
      "setSurvey",
      "setParticipant",
      "setInterview",
      "setPageSet",
      "setWorkflow",
      "setPage",
      "setUser",
      "setError",
      "clearErrors"
    ]),
    ...mapActions([
      "saveParticipant",
      "saveItems",
      "deleteParticipant",
      "deleteInterview"
    ]),
    pushSaveItems(items, onSaved) {
      return pushSave(() => this.saveItems(items), onSaved);
    },
    onSaveFlushed(callback) {
      return pushSave(() => Promise.resolve(), callback);
    },
    pushSaveParticipant(participant, onSaved) {
      return pushSave(() => this.saveParticipant(participant), onSaved);
    },
    delaySave,
    cancelSave,
    resumeSave,
    async createFirstInterviewIfNotExists() {
      const first = this.currentParticipant.first(this.currentWorkflow);
      if (
        this.availableInterviews.every(i => i.pageSet != first) &&
        !this.pendingStudioModification
      ) {
        this.createInterview(first);
      }
    },
    async createInterview(pageSet) {
      this.setPageSet(pageSet);
      this.setPage(undefined);
      this.setInterview(undefined);
      await this.saveItems([]);
    }
  }
};
