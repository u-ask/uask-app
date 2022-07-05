<template>
  <v-btn
    :icon="!label"
    :outlined="!label"
    :color="label ? '' : 'info'"
    :plain="label"
    @click="startDeletion()"
    :disabled="pendingStudioModification"
    :id="`delete-item-button-${item.variableName}`"
  >
    <v-icon v-if="!label">mdi-delete</v-icon>
    <span v-else>{{
      customLabel
        ? customLabel
        : item
        ? getLabel("mlstring", {}, item.wording, $i18n)
        : ""
    }}</span>
  </v-btn>
</template>

<script>
import { DeleteItemCommand } from "uask-studio";
import { getItem } from "uask-dom";
import studioState from "../../mixin/studioState";
export default {
  props: ["item", "label", "count", "customLabel"],
  methods: {
    async startDeletion() {
      this.setUnfoldedItem(this.item);
      this.start(this.command);
    },
    command(state) {
      return state.start(
        DeleteItemCommand,
        this.pageIndex,
        this.getItemIndex(),
        this.count ?? 1
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
