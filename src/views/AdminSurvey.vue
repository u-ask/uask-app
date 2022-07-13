<template>
  <v-card outlined>
    <v-card-title class="d-flex justify-content-between">
      <div class="pt-3 pl-2">{{ $t($route.name.split(" ").join("")) }}</div>
      <div :class="{ 'd-flex': !mobile }">
        <print-Data participant="blank" class="mx-3"></print-Data>
        <print-Data participant="annotated" class="mx-3"></print-Data>
      </div>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <survey-import></survey-import>
      <survey-export></survey-export>
    </v-card-text>
  </v-card>
</template>

<script>
import SurveyImport from "../components/admin/SurveyImport.vue";
import SurveyExport from "../components/admin/SurveyExport.vue";
import PrintData from "../components/tools/PrintData.vue";
export default {
  components: { SurveyImport, SurveyExport, PrintData },
  i18n: {
    messages: {
      en: {
        Adminsurvey: "Survey administration"
      },
      fr: {
        Adminsurvey: "Admnistration de l'étude"
      }
    }
  }
};
</script>
