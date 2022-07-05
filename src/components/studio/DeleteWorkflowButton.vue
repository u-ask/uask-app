<template>
  <v-btn
    icon
    outlined
    color="info"
    @click="startDeletion()"
    :disabled="pendingStudioModification"
    :id="`delete-workflow-${workflowName}`"
  >
    <v-icon>mdi-delete</v-icon>
  </v-btn>
</template>

<script>
import { DeleteWorkflowCommand } from "uask-studio";
import studioState from "../../mixin/studioState";

export default {
  props: {
    workflowIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    workflowName() {
      return this.currentSurvey.workflows[this.workflowIndex]?.name;
    }
  },
  methods: {
    async startDeletion() {
      const { started } = this.start(this.command);
      started.then(({ result }) => {
        if (result == "applied") this.$emit("updated");
      });
    },
    async command(state) {
      return state.start(
        DeleteWorkflowCommand,
        this.workflowIndex,
        this.pageSetIndex
      );
    }
  },
  mixins: [studioState]
};
</script>
