<template>
  <v-btn
    icon
    outlined
    color="info"
    @click="startModification()"
    :disabled="pendingStudioModification"
    :id="`edit-workflow-${workflowName}`"
  >
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<script>
import { UpdateWorkflowCommand } from "uask-studio";
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
    async startModification() {
      const { started } = this.start(this.command);
      started.then(({ result }) => {
        if (result == "applied") this.$emit("updated");
      });
    },
    async command(state) {
      return state.start(
        UpdateWorkflowCommand,
        this.workflowIndex,
        this.pageSetIndex
      );
    }
  },
  mixins: [studioState]
};
</script>
