<template>
  <div>
    <template>
      <v-btn
        v-if="!pendingStudioModification"
        :id="`delete-page-${index}`"
        icon
        color="info"
        small
        @click="startDeletion()"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
import { DeletePageCommand } from "uask-studio";
import studioState from "../../mixin/studioState";

export default {
  props: {
    index: {
      type: Number
    }
  },
  methods: {
    async startDeletion() {
      this.start(this.command);
    },
    async command(state) {
      return state.start(DeletePageCommand, this.pageSetIndex, this.index);
    }
  },
  mixins: [studioState]
};
</script>
