<template>
  <v-row>
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
    }
  }
};
</script>
