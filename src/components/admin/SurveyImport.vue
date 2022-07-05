<template>
  <div>
    <v-card elevation="0" class="mt-3">
      <v-card-title>
        {{ $t("import") }}
      </v-card-title>
      <v-card-subtitle>{{ $t("maj") }}</v-card-subtitle>
      <v-card-text>
        <v-file-input
          accept=".json"
          outlined
          :value="jsonFile"
          @change="readFileContent($event)"
        ></v-file-input>
      </v-card-text>
    </v-card>
    <v-alert v-if="!isSelectedSurvey && !!jsonFileContent" type="error">
      {{ $t("notSameSurvey") }}
    </v-alert>
    <div v-if="isSelectedSurvey" class="text-right my-3">
      <action-panel @action="onAction($event)"></action-panel>
    </div>
    <survey-details
      :surveyFileContent="jsonFileContent"
      :surveyFile="jsonFile"
      v-if="jsonFile"
    ></survey-details>

    <!-- Double confirmation -->
    <v-dialog v-model="dialog" persistent max-width="400">
      <base-card>
        <v-card-title>{{ $t("updateSurvey") }}</v-card-title>
        <v-card-text>{{ $t("alertUpdate") }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" outlined color="danger">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn @click="saveSurvey()" color="primary">
            OK
          </v-btn>
        </v-card-actions>
      </base-card>
    </v-dialog>

    <!-- Confirmation du save -->
    <v-snackbar top></v-snackbar>
  </div>
</template>

<script>
import BaseCard from "@/arctic/components/base/Card.vue";
import SurveyDetails from "./SurveyDetails.vue";
import ActionPanel from "./ActionPanelAdmin.vue";
import { SurveyBuilder } from "uask-dom";
import { surveyDeserialize } from "uask-sys";
export default {
  data() {
    return {
      dialog: false,
      jsonFile: undefined,
      jsonFileContent: undefined
    };
  },
  computed: {
    isSelectedSurvey() {
      return this.jsonFileContent?.name == this.$route.params.survey;
    }
  },
  methods: {
    async readFileContent(file) {
      this.jsonFile = file;
      this.jsonFileContent = file ? JSON.parse(await file?.text()) : undefined;
    },
    async onAction({ type }) {
      switch (type) {
        case "save":
          this.dialog = true;
          break;
        case "cancel":
          this.cancelImport();
          break;
      }
    },
    async saveSurvey() {
      this.dialog = false;
      const b = new SurveyBuilder();
      surveyDeserialize(b, this.jsonFileContent);
      await this.drivers.surveyDriver.save(b.get());
      const updatedSurvey = await this.drivers.surveyDriver.getByName(
        this.$route.params.survey
      );
      this.setSurvey(updatedSurvey);
    },
    cancelImport() {
      this.jsonFile = undefined;
      this.jsonFileContent = undefined;
    }
  },
  i18n: {
    messages: {
      en: {
        import: "Import a survey as a JSON file",
        maj: "By importing a file you will update the selected survey.",
        updateSurvey: "Do you want to update this survey ?",
        alertUpdate: "Be careful, this action is irreversible.",
        notSameSurvey:
          "Be carefull, the imported survey does not have the same name as the selected survey. Please verify your file or change it."
      },
      fr: {
        import: "Importer une étude au format JSON",
        maj:
          "En important un fichier vous mettrez à jour l'étude sélectionnée ci-dessus.",
        updateSurvey: "Voulez-vous mettre à jour cette étude ?",
        alertUpdate: "Attention cette action est irréversible",
        notSameSurvey:
          "Attention, le nom de l'étude importée est différente de l'étude selectionnée. Merci de vérifier votre fichier ou de le changer."
      }
    }
  },
  components: {
    BaseCard,
    SurveyDetails,
    ActionPanel
  }
};
</script>
