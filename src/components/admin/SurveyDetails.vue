<template>
  <v-card elevation="0">
    <v-card-title>
      {{ $t("title") }}
    </v-card-title>
    <div class="pl-2">
      <v-card-text>
        <strong>{{ $t("surveyName") }} : </strong>
        {{ surveyName }}
      </v-card-text>
      <v-card-text>
        <strong>{{ $t("fileSize") }} : </strong>
        {{ surveyFile.size + " octets" }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["surveyFile", "surveyFileContent"],
  computed: {
    surveyName() {
      return this.surveyFileContent?.name ?? "";
    }
  },
  i18n: {
    messages: {
      en: {
        title: "Imported survey file details",
        surveyName: "Survey Name",
        fileSize: "File Size"
      },
      fr: {
        title: "Détails du fichier d'étude importé",
        surveyName: "Nom de l'étude",
        fileSize: "Taille du fichier"
      }
    }
  }
};
</script>
