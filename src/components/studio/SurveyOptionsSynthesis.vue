<template>
  <div v-if="display" class="col-12 px-0">
    <div class="d-flex justify-space-between">
      <h4>{{ $t("surveyOptions") }}</h4>
      <v-btn @click="display = false" icon id="hide-survey-options"
        ><v-icon>mdi-eye-off</v-icon></v-btn
      >
    </div>
    <v-divider class="mt-0"></v-divider>
    <v-alert
      border="left"
      color="info"
      colored-border
      elevation="1"
      class="px-10"
    >
      <div class="d-flex justify-end">
        <edit-survey-options-button
          class="mx-4"
          @updated="loadOptions()"
        ></edit-survey-options-button>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="20"
        hide-default-footer
      ></v-data-table>
    </v-alert>
  </div>
  <div v-else class="d-flex flex-wrap mr-2">
    <v-btn @click="display = true" color="info" outlined id="show-survey-options"
      ><v-icon left>mdi-eye</v-icon>{{ $t("surveyOptions") }}</v-btn
    >
  </div>
</template>

<script>
import EditSurveyOptionsButton from "./EditSurveyOptionsButton.vue";
export default {
  components: { EditSurveyOptionsButton },
  data() {
    return {
      display: false,
      surveyOptions: undefined
    };
  },
  computed: {
    headers() {
      return [
        { text: "Option", value: "option" },
        { text: this.$t("value"), value: "value" }
      ];
    },
    items() {
      return Object.keys(this.surveyOptions)
        ?.filter(k => k != "workflowVar")
        .map(k => ({
          option: k,
          value:
            this.surveyOptions?.[k]?.name ??
            (typeof this.surveyOptions?.[k] == "string"
              ? this.surveyOptions?.[k]
              : JSON.stringify(this.surveyOptions?.[k]))
        }));
    }
  },
  methods: {
    loadOptions() {
      this.surveyOptions = this.currentSurvey.options;
    }
  },
  mounted() {
    this.loadOptions();
  },
  i18n: {
    messages: {
      en: {
        surveyOptions: "Survey Options",
        value: "Value"
      },
      fr: {
        surveyOptions: "Options de l'étude",
        value: "Valeur"
      }
    }
  }
};
</script>
