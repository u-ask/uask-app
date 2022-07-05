<template>
  <div
    class="d-flex justify-end align-center m-1"
    :class="{ 'justify-space-around mx-0': mobile }"
  >
    <v-chip
      id="currentParticipantSampleCode"
      label
      class="white--text"
      :class="{ col: mobile }"
      :color="color"
    >
      {{ $t("domain.noSample") }}: {{ currentParticipant.sample.sampleCode }}
    </v-chip>
    <v-chip
      id="currentParticipantCode"
      label
      class="ml-1 white--text"
      :class="{ col: mobile }"
      :color="color"
    >
      {{ $t("domain.noParticipant") }}: {{ participantCode }}
    </v-chip>
    <v-chip
      id="currentPatienFrozen"
      v-if="this.currentParticipant.sample.frozen"
      label
      class="white--text"
      :class="{ col: mobile }"
      :color="color"
    >
      {{ $t("frozen") }}
    </v-chip>
  </div>
</template>

<script>
import { formatCode } from "uask-dom";
export default {
  computed: {
    participantCode() {
      const currentParticipantCode = formatCode(
        this.currentParticipant,
        this.currentSurvey.options
      );
      return currentParticipantCode == "" ? this.$t("pending") : currentParticipantCode;
    },
    frozen() {
      return this.currentParticipant.sample.frozen;
    },
    color() {
      return this.frozen ? "danger" : "info";
    }
  },
  i18n: {
    messages: {
      en: { pending: "Pending", frozen: "frozen" },
      fr: { pending: "En attente", frozen: "gelé" }
    }
  }
};
</script>
