<template>
  <div id="document-table">
    <v-card>
      <v-data-table :headers="headers" :items="rows">
        <template v-slot:[`item.Titre`]="{ item }">
          <span> {{ item.Titre }}</span>
        </template>
        <template v-slot:[`item.Tags`]="{ item }">
          <v-chip-group column>
            <v-chip
              v-for="tag in item.Tags"
              :key="tag"
              color="primary"
              outlined
            >
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-chip
            class="mr-2"
            @click="download(item.hash)"
            color="success"
            icon
          >
            <v-icon>mdi-download</v-icon>
          </v-chip>
          <v-chip
            v-if="canDelete"
            @click="deleteItem(item.hash)"
            color="danger"
            icon
          >
            <v-icon color="white">mdi-delete</v-icon>
          </v-chip>
        </template>
      </v-data-table>
      <token-loader :url="documentUrl" @finished="documentUrl = undefined">
      </token-loader>
    </v-card>
  </div>
</template>

<script>
import { getAllTags } from "uask-sys";
import TokenLoader from "../tools/TokenLoader.vue";

export default {
  props: ["filter"],
  data() {
    return {
      allTagsDb: [],
      allDocuments: [],
      documentUrl: undefined
    };
  },
  computed: {
    canDelete() {
      return this.authorizationManager.canSaveDocument();
    },
    allTags() {
      return this.allTagsDb
        .map(tag => this.getLabel("mlstring", {}, tag, this.$i18n))
        .sort();
    },
    filteredDocuments() {
      return this.filter?.tags?.length > 0
        ? this.allDocuments.filter(d => {
            return this.filter?.tags.every(t => d.tags?.includes(t));
          })
        : this.allDocuments;
    },
    rows() {
      return this.filteredDocuments.map(d => ({
        [this.$t("title")]: this.getLabel("mlstring", {}, d.title, this.$i18n),
        ["format"]: this.getFileExtension(d.name),
        [this.$t("tags")]: d.tags?.map(t =>
          this.getLabel("mlstring", {}, t, this.$i18n)
        ),
        ["hash"]: d.hash
      }));
    },
    headers() {
      return [
        { text: this.$t("title"), value: this.$t("title") },
        { text: "Format", value: "format" },
        { text: this.$t("tags"), value: this.$t("tags") },
        { text: "Actions", value: "actions", sortable: false }
      ];
    }
  },
  methods: {
    async download(hash) {
      this.documentUrl = `${process.env.VUE_APP_API_URL}/document/${this.currentSurvey.name}/${hash}/content`;
    },
    getFileExtension(filename) {
      var ext = /^.+\.([^.]+)$/.exec(filename);
      return ext == null ? "" : ext[1];
    },
    async deleteItem(hash) {
      const deleteUrl = `document/${this.currentSurvey.name}/${hash}`;
      await this.drivers.client.delete(deleteUrl);
      const deleteIndex = this.allDocuments.findIndex(doc => doc.hash == hash);
      this.allDocuments.splice(deleteIndex, 1);
    }
  },
  watch: {
    allTags(value) {
      this.$emit("input", { tags: value });
    }
  },
  async mounted() {
    this.allDocuments = await this.drivers.documentDriver.getAll(
      this.currentSurvey
    );
    this.allTagsDb = getAllTags(this.allDocuments);
  },
  i18n: {
    messages: {
      en: {
        title: "Title",
        tags: "Tags"
      },
      fr: {
        title: "Titre",
        tags: "Tags"
      }
    }
  },
  components: {
    TokenLoader
  }
};
</script>
