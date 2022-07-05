<template>
  <div>
    <v-file-input
      :disabled="disabled"
      :readonly="readonly"
      @change="upload($event)"
      @click:clear="upload(undefined)"
      accept="image/*"
    ></v-file-input>
    <img class="image-viewer" v-if="src" :src="src" />
  </div>
</template>

<script>
import { Document } from "uask-sys";

export default {
  props: ["name", "value", "disabled", "readonly"],
  data() {
    return {
      src: undefined
    };
  },
  computed: {
    documentId() {
      return `${this.currentParticipant.participantCode}/${this.currentInterview.nonce}/${this.name}`;
    }
  },
  methods: {
    async upload(file) {
      if (file != undefined) {
        const document = new Document(this.documentId, "", undefined, {
          visibility: "participant"
        });
        const { hash } = await this.drivers.documentDriver.save(
          this.currentSurvey,
          document
        );
        const body = new Uint8Array(await this.readFile(file));
        const baseUrl = `document/${this.currentSurvey.name}/${hash}/content`;
        await this.drivers.client.post(baseUrl, {
          body,
          headers: { "Content-Type": "application/octet-stream" }
        });
        if (hash != this.value && file != undefined) this.$emit("change", hash);
        else {
          this.src = undefined;
          setTimeout(() => {
            this.loadImg();
          }, 300);
        }
      } else {
        this.$emit("change", undefined);
        this.loadImg();
      }
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", e => resolve(e.target.result));
        reader.addEventListener("error", reject);
        reader.readAsArrayBuffer(file);
      });
    },
    async loadImg() {
      if (this.value != undefined) {
        const { shortToken } = await this.drivers.client
          .get("shorttoken/generate")
          .json();
        this.src = `${process.env.VUE_APP_API_URL}/document/${this.currentSurvey.name}/${this.value}/content?shortToken=${shortToken}`;
      } else this.src = undefined;
    }
  },
  async mounted() {
    this.loadImg();
  },
  watch: {
    value() {
      this.loadImg();
    }
  }
};
</script>

<style scoped>
.image-viewer {
  max-height: 300px;
}
</style>
