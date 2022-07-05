<template>
  <div class="d-inline-flex" :class="{ 'col p-0': mobile }">
    <v-menu color="light" class="mb-2 col-sm-3" offset-y :allow-overflow="true">
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          id="dropdownPageSets"
          v-bind="attrs"
          v-on="on"
          class="bg-white"
          :class="{ 'col-12 overflow-hidden': mobile }"
          block
          text
          outlined
          :disabled="pendingStudioModification"
        >
          <page-set-label :interview="currentInterview"></page-set-label>
          <v-spacer></v-spacer>
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-item-group id="pagesetgroup" class="bg-white">
        <v-list-item
          v-for="(interview, index) in availableInterviews"
          :key="index"
          :id="`pageSet${index}`"
          :color="isSelected(interview) ? 'primary' : ''"
          :input-value="isSelected(interview)"
          :data-active="interview == currentInterview"
          name="pageset"
          @click="changeInterview(interview)"
        >
          <page-set-label :interview="interview"></page-set-label>
        </v-list-item>

        <workflow-page-set-picker
          v-if="canCreateInterview"
          :pagesets="availablePageSets"
          data-workflow="available"
          @pageset-picked="setTemp($event)"
        ></workflow-page-set-picker>
      </v-item-group>
    </v-menu>
    <v-snackbar
      top
      multi-line
      vertical
      light
      outlined
      max-height="600"
      v-model="startNewInterview"
    >
      {{ $t("newInterview") }} :
      <lang-label
        v-if="tempPageSet != null"
        :labels="tempPageSet.type"
      ></lang-label>
      <template v-slot:action="{ attrs }">
        <v-btn
          id="createInterview"
          v-bind="attrs"
          @click="createNewInterview()"
          text
          color="primary"
        >
          Ok
        </v-btn>
        <v-btn
          v-bind="attrs"
          @click="startNewInterview = false"
          text
          color="danger"
        >
          Cancel
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import LangLabel from "../input/LangLabel";
import WorkflowPageSetPicker from "./WorkflowPageSetPicker.vue";
import PageSetLabel from "./PageSetLabel.vue";

export default {
  data() {
    return {
      startNewInterview: false,
      tempPageSet: undefined
    };
  },
  computed: {
    currentIndex() {
      return this.availableInterviews.indexOf(this.currentInterview);
    },
    interviewDate() {
      return this.currentInterview?.date;
    },
    interviewPageSetType() {
      return this.currentInterview?.pageSet.type;
    },
    canCreateInterview() {
      return !this.isStudioMode && this.authorizationManager.canCreate();
    }
  },
  methods: {
    changeInterview(interview) {
      this.setInterview(interview);
    },
    status(interview) {
      return interview.status ?? "incomplete";
    },
    async createNewInterview() {
      if (this.startNewInterview) {
        this.startNewInterview = false;
        this.createInterview(this.tempPageSet);
        this.tempPageSet = undefined;
      }
    },
    setTemp(pageSet) {
      this.startNewInterview = true;
      this.tempPageSet = pageSet;
    },
    isSelected(interview) {
      return this.currentInterview == interview;
    }
  },
  beforeMount() {
    this.createFirstInterviewIfNotExists();
  },
  components: {
    LangLabel,
    WorkflowPageSetPicker,
    PageSetLabel
  },
  i18n: {
    messages: {
      en: {
        newInterview: "Would you like to create the new interview",
        availablePageSet: "Available interviews",
        nextInterview: "Next Interview",
        lastInterview: "Last Interview"
      },
      fr: {
        newInterview: "Voulez-vous créer la nouvelle interview",
        availablePageSet: "Interviews disponibles",
        nextInterview: "Interview Suivante",
        lastInterview: "Dernière Interview"
      }
    }
  }
};
</script>

<style>
.v-item-group {
  max-height: 500px !important;
  overflow-y: auto !important;
}
</style>
