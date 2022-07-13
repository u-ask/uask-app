<template>
  <v-card elevation="0" class="mt-3">
    <v-card-title>
      {{ $t("export") }}
    </v-card-title>
    <v-card-text>
      <v-chip class="mr-2" @click="download()" color="success" icon>
        <v-icon>mdi-download</v-icon>
      </v-chip>
      <a :href="href" :download="name" hidden ref="download">Export</a>
    </v-card-text>
  </v-card>
</template>

<script>
import { surveySerialize } from "uask-sys";

export default {
  computed: {
    href() {
      const json = surveySerialize(this.currentSurvey);
      const data = JSON.stringify(json);
      const blob = new Blob([data], {
        type: "application/json"
      });
      return URL.createObjectURL(blob);
    },
    name() {
      return `${this.currentSurvey.name}.json`;
    }
  },
  methods: {
    download() {
      this.$refs.download.click();
    }
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.href);
  },
  i18n: {
    messages: {
      en: {
        export: "Export survey"
      },
      fr: {
        export: "Exporter l'étude"
      }
    }
  }
};
</script>
