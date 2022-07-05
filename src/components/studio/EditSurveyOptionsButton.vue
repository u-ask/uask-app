<template>
  <v-btn
    icon
    outlined
    color="info"
    @click="startModification()"
    :disabled="pendingStudioModification"
    :id="`edit-survey-options`"
  >
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<script>
import { UpdateSurveyOptionsCommand } from "uask-studio";
import studioState from "../../mixin/studioState";
export default {
  methods: {
    async startModification() {
      const { started } = this.start(this.command);
      started.then(({ result }) => {
        if (result == "applied") this.$emit("updated");
      });
    },
    async command(state) {
      return state.start(UpdateSurveyOptionsCommand, this.pageSetIndex);
    }
  },
  mixins: [studioState]
};
</script>
