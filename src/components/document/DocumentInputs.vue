<template>
  <div>
    <v-card-title>{{ $t("addDoc") }}</v-card-title>
    <base-card class="mt-3">
      <v-card-text>
        <div id="title" class="px-5">
          <h5>{{ $t("title") }}</h5>
          <text-input v-model="document.title"></text-input>
        </div>
      </v-card-text>
    </base-card>
    <base-card class="mt-3">
      <v-card-text>
        <div id="file" class="px-5">
          <h5>{{ $t("file") }}</h5>
          <v-file-input outlined v-model="document.file"></v-file-input>
        </div>
      </v-card-text>
    </base-card>
    <base-card class="mt-3">
      <v-card-text>
        <div id="tags" class="px-5">
          <h5>{{ $t("tags") }}</h5>
          <multiple-choice-input
            :type="allTags"
            :compact="true"
            :chipsColor="'primary'"
            :value="document.tags"
            @change="document.tags = $event"
          >
          </multiple-choice-input>
        </div>
      </v-card-text>
    </base-card>
    <div class="my-3 text-right">
      <action-panel
        @action="onAction($event)"
        :saveDisabled="!document.title || !document.file"
      ></action-panel>
    </div>
    <v-alert v-if="uploadFailed" type="error">
      {{ $t("uploadfailed") }}
    </v-alert>
  </div>
</template>

<script>
import BaseCard from "../../arctic/components/base/Card";
import ActionPanel from "../admin/ActionPanelAdmin";
import TextInput from "../input/TextInput";
import MultipleChoiceInput from "../input/MultipleChoiceInput.vue";
import { Document, getAllTags } from "uask-sys";
export default {
  data() {
    return {
      allTagsDb: [],
      document: {
        title: undefined,
        tags: undefined,
        file: undefined,
        hash: undefined
      },
      uploadFailed: false
    };
  },
  computed: {
    allTags() {
      return this.allTagsDb
        .map(tag => this.getLabel("mlstring", {}, tag, this.$i18n))
        .sort();
    }
  },
  methods: {
    async onAction({ type }) {
      switch (type) {
        case "save":
          await this.createDocument();
          await this.uploadDocumentContent()
            .then(() => {
              this.uploadFailed = false;
              this.goToDocumentList();
            })
            .catch(() => {
              this.uploadFailed = true;
            });
          break;
        case "cancel":
          this.uploadFailed = false;
          this.goToDocumentList();
          break;
      }
    },
    createDocument() {
      return new Promise(r =>
        setTimeout(async () => {
          const document = new Document(
            this.document.file.name,
            this.document.title,
            this.document.tags
          );
          const { hash } = await this.drivers.documentDriver.save(
            this.currentSurvey,
            document
          );
          this.document.hash = hash;
          r();
        })
      );
    },
    async uploadDocumentContent() {
      const baseUrl = `document/${this.currentSurvey.name}/${this.document.hash}/content`;
      const body = await this.getAsByteArray(this.document.file);
      await this.drivers.client.post(baseUrl, {
        body,
        headers: { "Content-Type": "application/octet-stream" }
      });
    },
    async getAsByteArray(file) {
      return new Uint8Array(await this.readFile(file));
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", e => resolve(e.target.result));
        reader.addEventListener("error", reject);
        reader.readAsArrayBuffer(file);
      });
    },
    goToDocumentList() {
      this.$router.push({
        name: "View documents",
        query: {
          survey: this.currentSurvey.name
        }
      });
    }
  },
  async mounted() {
    const allDocuments = await this.drivers.documentDriver.getAll(
      this.currentSurvey
    );
    this.allTagsDb = getAllTags(allDocuments);
  },
  i18n: {
    messages: {
      en: {
        addDoc: "Add a document",
        title: "Title",
        file: "File",
        tags: "Tags",
        uploadfailed: "The document can't be upload."
      },
      fr: {
        addDoc: "Ajout de document",
        title: "Titre",
        file: "Fichier",
        tags: "Tags",
        uploadfailed: "Le document n'a pas pu être ajouté."
      }
    }
  },
  components: {
    BaseCard,
    TextInput,
    MultipleChoiceInput,
    ActionPanel
  }
};
</script>
