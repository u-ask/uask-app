<template>
  <v-btn
    icon
    outlined
    color="info"
    @click="startDeletion()"
    :disabled="pendingStudioModification"
    :id="`delete-pageset`"
  >
    <v-icon>mdi-delete</v-icon>
  </v-btn>
</template>

<script>
import { DeletePageSetCommand } from "uask-studio";
import studioState from "../../mixin/studioState";
export default {
  methods: {
    async startDeletion() {
      this.start(this.command);
    },
    async command(state) {
      return state.start(DeletePageSetCommand, this.pageSetIndex);
    }
  },
  mixins: [studioState]
};
</script>
