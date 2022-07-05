<template>
  <v-btn
    outlined
    class="bg-gray-100"
    color="info"
    @click="startInsertion()"
    v-if="!pendingStudioModification"
    id="insert-workflow"
  >
    <span>{{ $t("addWorkflow") }}</span>
  </v-btn>
</template>

<script>
import studioState from "../../mixin/studioState";
import { InsertWorkflowCommand } from "uask-studio";
export default {
  methods: {
    async startInsertion() {
      const { started } = this.start(this.command);
      started.then(({ result }) => {
        if (result == "applied") this.$emit("updated");
      });
    },
    async command(state) {
      return state.start(InsertWorkflowCommand, this.pageSetIndex);
    }
  },
  mixins: [studioState],
  i18n: {
    messages: {
      en: {
        addWorkflow: "Add a new workflow"
      },
      fr: {
        addWorkflow: "Ajouter un nouveau workflow"
      }
    }
  }
};
</script>
