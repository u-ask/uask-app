<template>
  <div class="overflow-hidden">
    <v-app-bar
      color="#2a2f45"
      class="px-sm text-left shadow-sm"
      flat
      :height="mobile ? '80' : '200'"
      absolute
      prominent
    >
      <v-container
        class="right d-flex d-flex-wrap items-center align-center"
        :class="{ 'mt-0 px-0': mobile, 'mt-6': !mobile }"
      >
        <span v-if="!mobile" class="d-inline-flex align-center">
          <adaptive-logo></adaptive-logo>
          <v-chip outlined color="success" class="mx-4"
            ><strong>uask</strong></v-chip
          >
        </span>

        <v-spacer v-if="!$vuetify.breakpoint.smAndDown" />

        <survey-navigator v-if="!mobile"></survey-navigator>
        <v-btn v-if="mobile" icon outlined color="white" href="/">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-spacer v-if="mobile"></v-spacer>
        <lang-selector v-if="langs.length > 1"></lang-selector>
        <user-menu></user-menu>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import LangSelector from "./user/LangSelector.vue";
import UserMenu from "./user/UserMenu.vue";
import SurveyNavigator from "./admin/SurveyNavigator.vue";
import AdaptiveLogo from "./tools/AdaptiveLogo.vue";
import langs from "../mixin/langs.js";

export default {
  mixins: [langs],
  components: { LangSelector, UserMenu, SurveyNavigator, AdaptiveLogo }
};
</script>
