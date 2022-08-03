<template>
  <v-btn
    :icon="!label"
    :outlined="!label"
    :color="label ? '' : 'info'"
    :plain="label"
    @click="startModification()"
    :disabled="pendingStudioModification"
    :id="`edit-item-button-${item ? item.variableName : 'undefined'}`"
  >
    <v-icon v-if="!label">mdi-pencil</v-icon>
    <span v-else>{{
      item ? getLabel("mlstring", {}, item.wording, $i18n) : ""
    }}</span>
  </v-btn>
</template>

<script>
import { UpdateItemCommand } from "uask-studio";
import { getItem } from "uask-dom";
import studioState from "../../mixin/studioState";
export default {
  props: ["item", "label"],
  methods: {
    async startModification() {
      this.setUnfoldedItem(this.item);
      this.start(this.command);
    },
    command(state) {
      return state.start(
        UpdateItemCommand,
        this.pageIndex,
        this.getItemIndex()
      );
    },
    getItemIndex() {
      return this.currentSurvey.pages[this.pageIndex].items.findIndex(
        i => getItem(i) == this.item
      );
    }
  },
  mixins: [studioState]
};
</script>

<style></style>
