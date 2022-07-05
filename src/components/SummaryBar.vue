<template>
  <v-app-bar dense :extended="$vuetify.breakpoint.xsOnly" fixed>
    <form-navigator></form-navigator>
    <template v-if="!$vuetify.breakpoint.xsOnly">
      <page-panel compact="true" class="col"></page-panel>
      <information-banner class="ml-auto"></information-banner>
    </template>
    <template v-slot:extension v-if="$vuetify.breakpoint.xsOnly">
      <page-panel compact="true" class="col"></page-panel>
    </template>
  </v-app-bar>
</template>

<script>
import InformationBanner from "./participant/InformationBanner.vue";
import PagePanel from "./form/PagePanel.vue";
import FormNavigator from "../components/FormNavigator";

export default {
  components: { InformationBanner, PagePanel, FormNavigator }
};
</script>
