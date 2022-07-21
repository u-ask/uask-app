<template>
  <div>
    <div v-if="!isIntersecting">
      <summary-bar></summary-bar>
    </div>
    <v-row>
      <v-col
        cols="12"
        class="d-md-inline-flex justify-md-space-between align-center flex-wrap"
        :class="{ 'pb-0': mobile }"
      >
        <div v-intersect="onIntersect" class="d-md-inline-flex align-baseline">
          <form-navigator :displayStudio="true"></form-navigator>
          <last-save-date
            v-if="!$vuetify.breakpoint.mdAndDown && !isStudioMode"
            class="ml-2"
          ></last-save-date>
          <toggle-visible v-if="isStudioMode" class="mx-5"></toggle-visible>
        </div>
        <information-banner v-if="isIntersecting"></information-banner>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <pageSet-viewer> </pageSet-viewer>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PageSetViewer from "../components/form/PageSetViewer";
import InformationBanner from "../components/participant/InformationBanner";
import SummaryBar from "../components/SummaryBar";
import FormNavigator from "../components/FormNavigator";
import LastSaveDate from "../components/form/LastSaveDate.vue";
import ToggleVisible from "../components/studio/ToggleVisible.vue";

export default {
  name: "ParticipantForm",
  data() {
    return {
      isIntersecting: true
    };
  },
  methods: {
    onIntersect(entries) {
      this.isIntersecting = entries[0].isIntersecting;
    }
  },
  components: {
    FormNavigator,
    PageSetViewer,
    InformationBanner,
    SummaryBar,
    LastSaveDate,
    ToggleVisible
  }
};
</script>
