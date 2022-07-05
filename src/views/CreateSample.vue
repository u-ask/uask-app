<template>
  <v-card>
    <v-card-title>
      <div class="pt-3 pl-2">{{ $t("newSample") }}</div>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <sample-inputs></sample-inputs>
    </v-card-text>
  </v-card>
</template>

<script>
import SampleInputs from "../components/admin/SampleInputs.vue";
export default {
  components: { SampleInputs },
  i18n: {
    messages: {
      en: {
        newSample: "Create a new sample"
      },
      fr: {
        newSample: "Créer un nouveau échantillon"
      }
    }
  }
};
</script>
