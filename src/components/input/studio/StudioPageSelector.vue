<template>
  <div class="border px-3 py-3">
    <v-autocomplete
      id="import-page-input"
      :value="selectedPages"
      :items="items"
      :item-text="i => label(i)"
      :item-value="i => i"
      multiple
      chips
      deletable-chips
      @change="onChange($event)"
    ></v-autocomplete>
    <div :id="`pages-selected`" class="border rounded col mt-3">
      <div v-if="selectedPages.length > 0">
        <span
          v-for="(page, index) in selectedPages"
          :key="`page-${index}`"
          class="d-flex my-0 py-1 col-8"
        >
          <v-chip
            class="mr-2 my-0 col flex-wrap"
            outlined
            :color="page.mandatory ? 'danger' : ''"
          >
            <v-avatar
              v-text="index + 1"
              class="primary white--text mr-2"
            ></v-avatar>
            <div class="text-wrap">{{ label(page) }}</div>
          </v-chip>
          <div class="d-inline-flex align-center align-self-center">
            <div>{{ $t("mandatory") }}</div>
            <acknowledge-input
              :id="`checkbox-mandatory-${page.name}`"
              class="ml-2"
              :value="selectedPages[index].mandatory"
              @change="mandatory(index, $event)"
            ></acknowledge-input>
          </div>
          <v-btn
            icon
            :id="`arrowUp-${page.name}`"
            :disabled="hideMoveArrowUp(index)"
            @click="move(index, -1)"
          >
            <v-icon v-show="!hideMoveArrowUp(index)">
              mdi-arrow-up
            </v-icon>
          </v-btn>
          <v-btn
            icon
            class="mr-2"
            :id="`arrowDown-${page.name}`"
            :disabled="hideMoveArrowDown(index)"
            @click="move(index, 1)"
          >
            <v-icon v-show="!hideMoveArrowDown(index)">
              mdi-arrow-down
            </v-icon>
          </v-btn>
        </span>
      </div>
      <div v-else>
        <v-alert class="mb-0" type="info" outlined dense>
          {{ $t("noElement") }}
        </v-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { getTranslation, DomainCollection } from "uask-dom";
import AcknowledgeInput from "../AcknowledgeInput.vue";

export default {
  props: ["value", "classes", "type"],
  data() {
    return {
      selectedPages: this.value ? [...this.value] : []
    };
  },
  computed: {
    items() {
      return this.type.labels.map(l => ({
        name: getTranslation(l, "__code__"),
        mandatory: this.currentPageSet.mandatoryPages?.some(
          p =>
            getTranslation(p.name, "__code__") == getTranslation(l, "__code__")
        )
      }));
    }
  },
  methods: {
    onChange(pageList) {
      this.selectedPages = pageList;
      this.send();
    },
    label({ name }) {
      const l = this.type.labels.find(
        l => getTranslation(l, "__code__") == name
      );
      return this.getLabel("mlstring", {}, l, this.$i18n);
    },
    mandatory(index, value) {
      this.selectedPages[index].mandatory = value;
      this.send();
    },
    send() {
      this.$emit(
        "input",
        this.selectedPages
          ? DomainCollection(...this.selectedPages)
          : DomainCollection()
      );
    },
    move(index, direction) {
      const element = this.selectedPages[index];
      this.selectedPages = [...this.selectedPages];
      this.selectedPages.splice(index, 1);
      this.selectedPages.splice(index + direction, 0, element);
      this.$emit("input", DomainCollection(...this.selectedPages));
    },
    hideMoveArrowDown(index) {
      return index == this.selectedPages.length - 1;
    },
    hideMoveArrowUp(index) {
      return index == 0;
    }
  },
  i18n: {
    messages: {
      en: {
        noElement: "No items to order at this time",
        mandatory: "Mandatory : "
      },
      fr: {
        noElement: "Pas d'éléments à ordonner pour le moment",
        mandatory: "Obligatoire : "
      }
    }
  },
  components: { AcknowledgeInput }
};
</script>
