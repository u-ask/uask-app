<template>
  <div class="mx-2">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          rounded
          elevation="0"
          :outlined="isAdminPage"
          :color="isAdminPage ? 'danger' : isStudioMode ? 'info' : 'success'"
          :class="isAdminPage ? '' : 'text-white'"
          v-on="on"
          v-bind="attrs"
        >
          <span v-if="!isAdminPage && !isStudioMode">
            <span v-if="!$vuetify.breakpoint.xsOnly">SURVEY : </span>
            <strong>{{ currentSurvey.name }}</strong>
          </span>
          <span v-else-if="isStudioMode">
            {{ currentSurvey.name }} - {{ $t("studio.studioMode") }}
          </span>
          <span v-else> {{ currentSurvey.name }} - ADMINISTRATION </span>
          <v-icon class="ml-2">mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list-item-group>
        <v-list-item
          v-for="(survey, i) in availableSurveys"
          :key="i"
          class="bg-white"
          :href="`/${survey}`"
        >
          {{ survey }}
        </v-list-item>
      </v-list-item-group>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("auth", ["surveys"]),
    isAdminPage() {
      return this.$route.name.includes("Admin");
    },
    availableSurveys() {
      return this.surveys
        ? Object.keys(this.surveys).filter(key =>
            !this.isAdminPage ? this.$route.params.survey != key : true
          )
        : [];
    }
  },
  methods: {
    navigateToSurvey(surveyName) {
      this.$router.push({
        path: `/${surveyName}`
      });
    }
  }
};
</script>

<style>
.v-list-item-group {
  max-height: 300px !important;
  overflow-y: auto !important;
}
</style>
