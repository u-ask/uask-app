<template>
  <v-card elevation="0" class="mx-0" outlined>
    <v-card-title class="border-bottom pb-0">
      <div
        class="align-baseline justify-space-between col"
        :class="{ 'd-flex': !mobile }"
      >
        <div>{{ $route.name }}</div>
        <v-btn
          color="primary"
          class="mb-3 align-self-right"
          elevation="0"
          outlined
          @click="newSample($route.params.survey)"
          :block="mobile"
        >
          {{ $t("createSample") }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <sample-list></sample-list>
    </v-card-text>
  </v-card>
</template>

<script>
import SampleList from "../components/admin/SampleList.vue";
export default {
  methods: {
    newSample() {
      this.$router.push({
        name: "Admin create sample"
      });
    }
  },
  components: { SampleList },
  i18n: {
    messages: {
      en: {
        createSample: "Add Sample"
      },
      fr: {
        createSample: "Ajouter un Échantillon"
      }
    }
  }
};
</script>
