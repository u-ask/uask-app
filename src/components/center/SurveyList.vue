<template>
  <div>
    <v-data-table :headers="headers" :items="items" light>
      <template v-slot:[`item.surveyName`]="{ item }">
        <v-chip outlined :href="goToSurvey(item.surveyName)">{{
          item.surveyName
        }}</v-chip>
      </template>
      <template v-slot:[`item.role`]="{ item }">
        {{ $t(`roles.${item.role}`) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="text-right">
          <v-menu offset-y v-if="canDuplicate(item.role)">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
            </template>
            <v-list>
              <v-list-item @click="initiateDuplication(item.surveyName)">{{
                $t("duplicate")
              }}</v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span>{{ `${$t("duplication")} ${surveyToDuplicate}` }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newSurveyName"
            :label="$t('newSurveyName')"
            :rules="[rules.surveyName]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="duplicate()">{{
            $t("action.save")
          }}</v-btn>
          <v-btn color="danger" text @click="dialog = false">{{
            $t("action.cancel")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { clone } from "uask-sys";
import users from "@/mixin/users";

export default {
  data() {
    return {
      dialog: false,
      surveyToDuplicate: "",
      newSurveyName: "",
      headers: [
        {
          text: this.$t("domain.survey"),
          value: "surveyName",
          class: "title"
        },
        { text: "Role", value: "role", class: "title" },
        { text: "", value: "actions" }
      ],
      rules: {
        surveyName: value => {
          const regex = /-/;
          return (
            regex.test(value) || 'Surveys name should contain "-" character'
          );
        }
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["surveys"]),
    items() {
      return Object.keys(this.surveys).map(survey => {
        return {
          surveyName: survey,
          role: this.surveys[survey]?.role
        };
      });
    }
  },
  methods: {
    ...mapMutations("auth", ["setProfile"]),
    initiateDuplication(surveyName) {
      this.surveyToDuplicate = surveyName;
      this.newSurveyName = `${surveyName}-COPY`;
      this.dialog = true;
    },
    goToSurvey(surveyName) {
      return `./${surveyName}`;
    },
    async duplicate() {
      const surveyExist = await this.drivers.surveyDriver
        .getByName(this.newSurveyName)
        .catch(() => undefined);
      if (this.newSurveyName && !surveyExist) {
        const survey = await this.drivers.surveyDriver.getByName(
          this.surveyToDuplicate
        );
        const clonedSurvey = clone(survey);
        clonedSurvey.survey(this.newSurveyName);
        const newSurvey = clonedSurvey.get();
        await this.drivers.surveyDriver.save(newSurvey);
        await this.reloadProfile();
        this.dialog = false;
      } else if (surveyExist) this.setError("This survey name already exist");
    },
    canDuplicate(role) {
      return ["developer", "administrator", "superadministrator"].includes(
        role
      );
    }
  },
  mixins: [users],
  i18n: {
    messages: {
      en: {
        duplicate: "DUPLICATE",
        surveyToDuplicate: "Survey to duplicate",
        newSurveyName: "New survey name",
        duplication: "Duplication of survey"
      },
      fr: {
        duplicate: "DUPLIQUER",
        surveyToDuplicate: "Etude à dupliquer",
        newSurveyName: "Nouveau nom de l'étude",
        duplication: "Duplication de l'étude"
      }
    }
  }
};
</script>

<style>
.title {
  font-size: 2rem;
}
</style>
