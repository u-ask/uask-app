<template>
  <div>
    <v-card elevation="0" class="mt-3">
      <v-card-title>
        {{ $t("import") }}
      </v-card-title>
      <v-card-text>
        <v-file-input
          accept=".json"
          outlined
          :value="jsonFile"
          @change="setFileContent($event)"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-alert
          class="mx-auto"
          v-if="!isSelectedSurvey && !!jsonFileContent"
          type="error"
        >
          {{
            $t("notSameSurvey", {
              required: currentSurvey.name,
              got: jsonFileContent.name
            })
          }}
        </v-alert>
        <v-spacer v-if="isSelectedSurvey"></v-spacer>
        <div v-if="isSelectedSurvey">
          <action-panel @action="onAction($event)"> </action-panel>
        </div>
      </v-card-actions>
    </v-card>

    <!-- Double confirmation -->
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
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
      </v-card>
    </v-dialog>

    <!-- Confirmation du save -->
    <v-snackbar top></v-snackbar>
  </div>
</template>

<script>
import ActionPanel from "../admin/ActionPanelAdmin.vue";
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
    async setFileContent(file) {
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
        import: "Import survey",
        updateSurvey: "Do you want to update this survey ?",
        alertUpdate: "Be careful, this action is irreversible.",
        notSameSurvey: "The imported survey must be {required}, got {got}."
      },
      fr: {
        import: "Importer l'étude",
        updateSurvey: "Voulez-vous mettre à jour cette étude ?",
        alertUpdate: "Attention cette action est irréversible",
        notSameSurvey:
          "Le nom de l'étude importée doit être {required} et non {got}."
      }
    }
  },
  components: {
    ActionPanel
  }
};
</script>
