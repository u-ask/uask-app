<template>
  <v-btn
    icon
    outlined
    color="info"
    @click="startModification()"
    :disabled="pendingStudioModification"
    :id="`insert-pageset`"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
import { InsertPageSetCommand } from "uask-studio";
import studioState from "../../mixin/studioState";
export default {
  methods: {
    startModification() {
      this.start(this.command);
    },
    command(state) {
      return state.start(InsertPageSetCommand).catch(() => {});
    }
  },
  mixins: [studioState]
};
</script>
