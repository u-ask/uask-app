<template>
  <v-col cols="12" class="d-flex flex-row-reverse px-0">
    <v-btn
      id="createDocument"
      elevation="0"
      color="primary"
      @click="createDocument()"
      :block="mobile"
    >
      {{ $t("addDocument") }}
    </v-btn>
  </v-col>
</template>

<script>
export default {
  methods: {
    createDocument() {
      this.$router.push({ name: "Document creation" });
    }
  },
  i18n: {
    messages: {
      en: { addDocument: "Add a document" },
      fr: { addDocument: "Ajouter un document" }
    }
  }
};
</script>
