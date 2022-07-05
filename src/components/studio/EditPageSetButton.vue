<template>
  <v-btn
    icon
    outlined
    color="info"
    @click="startModification()"
    :disabled="pendingStudioModification"
    id="edit-pageset"
  >
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<script>
import { UpdatePageSetCommand } from "uask-studio";
import studioState from "../../mixin/studioState";
export default {
  methods: {
    async startModification() {
      this.start(this.command);
    },
    async command(state) {
      return state.start(UpdatePageSetCommand, this.pageSetIndex);
    }
  },
  mixins: [studioState]
};
</script>
