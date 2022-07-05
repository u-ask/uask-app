<template>
  <div>
    <v-data-table
      id="sampleList"
      :headers="headers"
      :items="items"
      mobile-breakpoint="800"
      class="my-5 mx-3"
      :search="search"
      item-key="sampleCode"
      show-expand
      single-expand
    >
      <template v-slot:top="{}">
        <div
          class="align-baseline col justify-space-between pb-0"
          :class="{ 'd-flex': !mobile, 'px-0': mobile }"
        >
          <h5 class="ml-2">{{ $t("samplesList") }}</h5>
          <v-spacer></v-spacer>
          <v-text-field
            outlined
            id="user-search"
            v-model="search"
            :label="$t('samplesSearch')"
            class="mw-50"
            clearable
          ></v-text-field>
        </div>
        <div class="d-inline-flex align-center">
          <div class="mx-3">{{ $t("allFrozen") }}</div>
          <v-switch
            id="freeze-all"
            :data-frozen="String(surveyFrozen)"
            :value="surveyFrozen"
            :disabled="surveyFrozen"
            @change="freezeSurvey()"
          ></v-switch>
        </div>
        <v-divider></v-divider>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <text-input v-model="item.name"> </text-input>
      </template>
      <template v-slot:[`item.frozen`]="{ item }">
        <v-switch
          :id="`freeze-${item.sampleCode}`"
          :data-frozen="String(item.frozen)"
          v-model="item.frozen"
        ></v-switch>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <text-input :label="$t('address')" v-model="item.address">
          </text-input>
        </td>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <div class="text-right">
      <div class="my-3 text-right">
        <action-panel
          @action="onAction($event)"
          :saveDisabled="!stale"
        ></action-panel>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from "../input/TextInput.vue";
import ActionPanel from "../admin/ActionPanelAdmin.vue";

export default {
  data() {
    return {
      search: "",
      samples: [],
      headers: [
        { text: this.$t("sampleCode"), value: "sampleCode" },
        { text: this.$t("name"), value: "name" },
        { text: this.$t("frozen"), value: "frozen" },
        { text: "", value: "data-table-expand" }
      ],
      items: []
    };
  },
  computed: {
    stale() {
      return this.samples.some((s, x) => s.update(this.items[x]) != s);
    },
    surveyFrozen() {
      return this.items.every(s => s.frozen);
    }
  },
  methods: {
    async loadSamples() {
      this.samples = await this.drivers.sampleDriver.getAll(this.currentSurvey);
      this.items = this.samples.map(s => {
        return {
          name: s.name,
          sampleCode: s.sampleCode,
          address: s.address,
          frozen: s.frozen
        };
      });
    },
    async saveSamples() {
      await Promise.all(
        this.samples.map(async (s, i) => {
          const updated = s.update(this.items[i]);
          const keys = await this.drivers.sampleDriver.save(
            this.currentSurvey,
            updated
          );
          this.samples[i] = updated.update(keys);
        })
      );
      await this.loadSamples();
    },
    freezeSurvey() {
      this.items = this.items.map(i => ({ ...i, frozen: true }));
    },
    async onAction({ type }) {
      switch (type) {
        case "cancel":
          await this.loadSamples();
          break;
        case "save":
          await this.saveSamples();
          break;
      }
    }
  },
  async mounted() {
    await this.loadSamples();
  },
  inject: ["needSave"],
  watch: {
    stale(value) {
      this.needSave(value);
    }
  },
  i18n: {
    messages: {
      en: {
        createSample: "New Sample",
        name: "Name",
        address: "Address",
        sampleCode: "Sample Code",
        samplesList: "Samples list",
        samplesSearch: "Samples search",
        frozen: "Frozen",
        allFrozen: "Survey frozen"
      },
      fr: {
        createSample: "Nouveau Échantillon",
        name: "Nom",
        address: "Adresse",
        sampleCode: "N° échantillon",
        samplesList: "Liste des échantillons",
        samplesSearch: "Recherche de échantillon",
        frozen: "Gelé",
        allFrozen: "Etude gelée"
      }
    }
  },
  components: {
    TextInput,
    ActionPanel
  }
};
</script>

<style>
#sampleList tr.v-data-table__expanded {
  box-shadow: none;
  background: rgba(0, 129, 255, 0.1);
}
#sampleList tr.v-data-table__expanded__row:hover {
  background: rgba(0, 129, 255, 0.1) !important;
}
#sampleList tr.v-data-table__expanded__row td {
  border-bottom: none !important;
}
#sampleList tr.v-data-table__expanded__content td {
  border-top: none !important;
  padding-bottom: 1em;
}
</style>
