<template>
  <v-col
    cols="12"
    :class="{
      'd-flex flex-row-reverse align-baseline': !mobile,
      'py-0': mobile
    }"
  >
    <div v-if="!mobile">
      <v-badge
        :value="!!message"
        class="font-italic"
        :color="messageColor"
        :content="message"
        tile
        left
        overlap
      >
        <v-btn
          id="createParticipant"
          elevation="0"
          color="primary"
          :disabled="disabled"
          @click="createParticipant()"
        >
          {{ $t("addParticipant") }}
        </v-btn>
      </v-badge>
    </div>
    <div v-else>
      <v-btn
        id="createParticipant"
        elevation="0"
        color="primary"
        :disabled="disabled"
        @click="createParticipant()"
        block
      >
        {{ $t("addParticipant") }}
      </v-btn>
    </div>
  </v-col>
</template>

<script>
import { ParticipantBuilder } from "uask-dom";

export default {
  props: ["sampleCode"],
  data() {
    return {
      allSamples: []
    };
  },
  computed: {
    disabled() {
      return !!this.message;
    },
    sample() {
      return this.allSamples.find(s => s.sampleCode == this.sampleCode);
    },
    message() {
      if (this.sample == undefined) return this.$t("noSample");
      if (this.sample.frozen) return this.$t("frozenSample");
      return undefined;
    },
    messageColor() {
      return this.sample?.frozen ? "danger" : "info";
    }
  },
  methods: {
    createParticipant() {
      const sample = this.allSamples.find(s => s.sampleCode == this.sampleCode);
      const participantBuilder = new ParticipantBuilder(this.currentSurvey, "", sample);
      participantBuilder.interview(this.currentSurvey.workflows[0].info);
      participantBuilder.interview(this.currentSurvey.workflows[0].sequence[0]);
      const participant = participantBuilder.build();
      const interview = participant.interviews.last;
      this.setParticipant(participant);
      this.setPageSet(interview.pageSet);
      this.setInterview(interview);
      this.$router.push({ name: "Participant creation" });
    }
  },
  async mounted() {
    this.allSamples = await this.drivers.sampleDriver.getAll(this.currentSurvey);
  },
  i18n: {
    messages: {
      en: {
        addParticipant: "Add a participant",
        noSample: "Please select a sample",
        frozenSample: "Sample is frozen"
      },
      fr: {
        addParticipant: "Ajouter un participant",
        noSample: "Veuillez sélectionner un sample",
        frozenSample: "Le sample est gelé"
      }
    }
  }
};
</script>
