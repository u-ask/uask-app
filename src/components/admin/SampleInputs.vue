<template>
  <div>
    <v-card-text>
      <div id="sampleCode" class="px-5 py-3 border rounded">
        <h5>{{ $t("sampleCode") }}</h5>
        <text-input v-model="sample.sampleCode" label="Ex: 001"></text-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="name" class="px-5 py-3 border rounded">
        <h5>{{ $t("name") }}</h5>
        <text-input
          v-model="sample.name"
          label="Ex: Échantillon de test"
        ></text-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="address" class="px-5 py-3 border rounded">
        <h5>{{ $t("address") }}</h5>
        <text-input
          v-model="sample.address"
          label="Ex: 26, rue Desaix - 75727 Paris"
        ></text-input>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <div class="my-3 text-right">
      <action-panel @action="onAction($event)"></action-panel>
    </div>
  </div>
</template>

<script>
import ActionPanel from "../admin/ActionPanelAdmin";
import TextInput from "../input/TextInput";
import { Sample } from "uask-dom";

export default {
  data() {
    return {
      sample: { name: undefined, sampleCode: undefined, address: undefined }
    };
  },
  methods: {
    async onAction({ type }) {
      switch (type) {
        case "save":
          await this.createSample();
          this.goToSampleList();
          break;
        case "cancel":
          this.goToSampleList();
          break;
      }
    },
    async createSample() {
      const sample = new Sample(this.sample.sampleCode, {
        name: this.sample.name,
        address: this.sample.address
      });
      await this.drivers.sampleDriver
        .save(this.currentSurvey, sample)
        .catch(err => {
          Array.isArray(err)
            ? err.map(error => this.setError(error))
            : this.setError(err);
        });
    },
    goToSampleList() {
      this.$router.push({
        name: "Admin samples",
        query: {
          survey: this.currentSurvey.name
        }
      });
    }
  },
  i18n: {
    messages: {
      en: {
        name: "Name",
        sampleCode: "Sample Code",
        address: "Address"
      },
      fr: {
        name: "Nom du échantillon",
        sampleCode: "N° échantillon",
        address: "Adresse"
      }
    }
  },
  components: {
    TextInput,
    ActionPanel
  }
};
</script>
