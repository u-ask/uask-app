<template>
  <div class="d-flex mr-200" :name="`move-item-${name}`">
    <v-icon
      :name="`move-up-item-${name}`"
      @click="move('up')"
      color="success"
      :disabled="pendingStudioModification"
      large
    >
      mdi-chevron-up
    </v-icon>
    <v-icon
      :name="`move-down-item-${name}`"
      @click="move('down')"
      color="success"
      :disabled="pendingStudioModification"
      large
    >
      mdi-chevron-down
    </v-icon>
  </div>
</template>

<script>
import { getItem, InterviewItem } from "uask-dom";
import { OrderItemCommand } from "uask-studio";
import studioState from "../../mixin/studioState";

export default {
  props: ["item"],
  data() {
    return {
      movePending: false
    };
  },
  computed: {
    name() {
      return this.item.variableName;
    }
  },
  methods: {
    async move(direction) {
      this.start(this.command, s => this.apply(s, direction));
    },
    command(state) {
      return state.start(OrderItemCommand, this.pageIndex, this.getItemIndex());
    },
    apply(state, direction) {
      const command = state.pending.command;
      this.pushSaveItems([
        new InterviewItem(command.directionPart, direction),
        new InterviewItem(command.applyPart, true)
      ]);
    },
    getItemIndex() {
      return this.currentPage.items.findIndex(i => getItem(i) == this.item);
    }
  },
  mixins: [studioState]
};
</script>

<style></style>
