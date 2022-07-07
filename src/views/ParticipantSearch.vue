<template>
  <v-row v-if="supportedSurvey">
    <v-col cols="12" :class="{ 'px-0': mobile }">
      <participant-filter @filterchanged="filter = $event"></participant-filter>
    </v-col>
    <v-col cols="12" :class="{ 'px-0': mobile }" v-if="canAdd">
      <add-participant :sampleCode="idSampleFilter"></add-participant>
    </v-col>
    <v-col cols="12" :class="{ 'px-0': mobile }">
      <participant-list :filter="filter"></participant-list>
    </v-col>
  </v-row>
  <div v-else>
    <v-card class="mx-auto" max-width="50em">
      <v-alert border="top" class="not-supported" color="red lighten-2" dark>
        {{ $t("compatibility") }}
        <br />
        <v-btn @click="$router.push('/')" text color="secondary">
          {{ $t("home") }}
        </v-btn>
      </v-alert>
    </v-card>
  </div>
</template>

<script>
import ParticipantFilter from "../components/participant/ParticipantFilter";
import ParticipantList from "../components/participant/ParticipantList";
import AddParticipant from "../components/participant/AddParticipant";

export default {
  components: {
    ParticipantFilter,
    ParticipantList,
    AddParticipant
  },
  data: function() {
    return {
      filter: {}
    };
  },
  computed: {
    canAdd() {
      const canStartWorkflow = this.currentWorkflow.pageSets.includes(
        this.currentSurvey.mainWorkflow.start
      );
      const canWrite = this.authorizationManager.canSaveUser();
      return canStartWorkflow && canWrite;
    },
    idSampleFilter() {
      return this.filter.fixed?.["@SAMPLE"];
    },
    supportedSurvey() {
      return (
        !!this.currentSurvey.mainWorkflow &&
        !!this.currentSurvey.mainWorkflow.info
      );
    }
  },
  i18n: {
    messages: {
      en: {
        home: "Go to home page",
        compatibility:
          "This application requires surveys that have a synthesis page.\nPlease fix it with the API or create a new one from the application home page."
      },
      fr: {
        home: "Aller sur la page d'accueil",
        compatibility:
          "Cette application nécessite que les études disposent d'une page de synthèse. Veuillez corriger cela en utilisant l'API ou en créer une nouvelle depuis la page d'accueil de l'application."
      }
    }
  }
};
</script>

<style scoped>
.not-supported {
  white-space: pre-line;
}
</style>
