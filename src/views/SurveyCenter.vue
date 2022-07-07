<template>
  <div>
    <base-card class="mt-2" :class="{ 'p-6': !mobile, 'p-2': mobile }">
      <v-card-title
        class="justify-space-between h4"
        :class="{ 'd-flex col align-center': !mobile, 'py-0': mobile }"
      >
        <span v-if="!mobile">{{ $t("mysurveys") }}</span>
        <create-survey-button
          class="pb-6 px-0"
          :class="{ 'col-12': mobile }"
        ></create-survey-button>
        <span v-if="mobile">{{ $t("mysurveys") }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <survey-list></survey-list>
    </base-card>
  </div>
</template>

<script>
import BaseCard from "@/arctic/components/base/Card.vue";
import SurveyList from "../components/center/SurveyList.vue";
import CreateSurveyButton from "../components/center/CreateSurveyButton.vue";
export default {
  components: { SurveyList, BaseCard, CreateSurveyButton },
  i18n: {
    messages: {
      en: {
        mysurveys: "Your Surveys"
      },
      fr: {
        mysurveys: "Vos Etudes"
      }
    }
  }
};
</script>
