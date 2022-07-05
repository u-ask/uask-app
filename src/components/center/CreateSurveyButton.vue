<template>
  <div>
    <v-btn
      color="success"
      outlined
      :rounded="!mobile"
      @click="dialog = true"
      id="new-survey-btn"
      :block="mobile"
    >
      {{ $t("newSurvey") }}
    </v-btn>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ $t("surveyParameters") }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="surveyName"
            :label="$t('surveyName')"
            :rules="[rules.surveyName]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="createSurvey()">{{
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
import { SurveyTemplate, ParticipantTemplate } from "uask-studio";
import { Sample } from "uask-dom";
import { mapGetters, mapMutations } from "vuex";
import users from "@/mixin/users";

export default {
  data() {
    return {
      dialog: false,
      surveyName: undefined,
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
    ...mapGetters("auth", [
      "surveys",
      "title",
      "givenName",
      "surname",
      "role",
      "email",
      "phone",
      "userid",
      "id",
      "email_verified"
    ])
  },
  methods: {
    ...mapMutations("auth", ["setProfile"]),
    async createSurvey() {
      const surveyExist = await this.drivers.surveyDriver
        .getByName(this.surveyName)
        .catch(() => undefined);
      if (this.surveyName && !surveyExist) {
        const survey = await this.addSurvey();
        await this.addSample(survey);
        await this.addParticipant(survey);
        await this.reloadProfile();
        this.dialog = false;
      } else if (typeof surveyExist != "undefined") {
        this.setError("This survey name already exist");
      }
    },
    async addSurvey() {
      await this.drivers.surveyDriver.save(new SurveyTemplate(this.surveyName));
      return await this.drivers.surveyDriver.getByName(this.surveyName);
    },
    async addSample(survey) {
      const sample = new Sample("TEST01", { name: "Test Center" });
      return this.drivers.sampleDriver.save(survey, sample);
    },
    async addParticipant(survey) {
      const samples = await this.drivers.sampleDriver.getAll(survey);
      await this.saveParticipant(survey, new ParticipantTemplate(survey, samples[0]));
    },
    async saveParticipant(survey, participant) {
      const keys = await this.drivers.participantDriver.save(survey, participant);
      const savedParticipant = participant.update(keys);
      for (const i of participant.interviews) {
        await this.drivers.interviewDriver.save(survey, savedParticipant, i);
      }
    }
  },
  mixins: [users],
  i18n: {
    messages: {
      en: {
        newSurvey: "New Survey",
        surveyParameters: "New survey",
        surveyName: "Survey name"
      },
      fr: {
        newSurvey: "Nouvelle Etude",
        surveyParameters: "Nouvelle Etude",
        surveyName: "Nom de l'étude"
      }
    }
  }
};
</script>
