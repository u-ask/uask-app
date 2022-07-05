<template>
  <div class="col d-inline-flex align-center">
    <div class="mr-3">{{ $t("studioMode") }}</div>
    <v-switch
      :disabled="pendingStudioModification"
      :value="isStudioMode"
      @change="studioMode($event)"
      id="studio-toggle"
    ></v-switch>
  </div>
</template>

<script>
import { ParticipantState, SurveyState } from "uask-studio";
import studioState from "../../mixin/studioState";
export default {
  computed: {
    isParticipantForm() {
      return this.$route.name == "Participant Data";
    }
  },
  methods: {
    studioMode(event) {
      const studioMode = !!event;
      this.setStudioMode(studioMode);
      const newSurvey = this.toggleSurvey(studioMode);
      if (this.isParticipantForm) this.toggleParticipant(studioMode, newSurvey);
    },
    toggleSurvey(studioMode) {
      const newSurvey = studioMode
        ? new SurveyState(this.currentSurvey)
        : this.currentSurvey.value;
      this.setSurvey(newSurvey);
      return newSurvey;
    },
    toggleParticipant(studioMode, newSurvey) {
      const newParticipant = studioMode
        ? new ParticipantState(newSurvey, this.currentParticipant)
        : this.currentParticipant.value;
      this.setParticipant(newParticipant);
      return newParticipant;
    }
  },
  mixins: [studioState],
  i18n: {
    messages: {
      en: {
        studioMode: "Studio Mode"
      },
      fr: {
        studioMode: "Mode Studio"
      }
    }
  }
};
</script>

<style></style>
