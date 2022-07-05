<template>
  <div v-if="display" class="col-12 px-0">
    <div class="d-flex justify-space-between">
      <h4>Workflows</h4>
      <v-btn @click="display = false" icon id="hide-workflows"
        ><v-icon>mdi-eye-off</v-icon></v-btn
      >
    </div>
    <v-divider class="mt-0"></v-divider>
    <v-alert
      v-for="(workflow, index) in workflows"
      :key="index"
      border="left"
      color="info"
      colored-border
      elevation="1"
      class="px-10"
      :id="workflow.name"
    >
      <div class="d-flex align-center justify-space-between">
        <h5>
          {{ workflow.name }}
        </h5>
        <div class="d-flex">
          <edit-workflow-button
            :workflowIndex="index"
            @updated="onUpdated()"
          ></edit-workflow-button>
          <delete-workflow-button
            v-if="!isMainWorkflow(workflow.name)"
            class="ml-2"
            :workflowIndex="index"
            @updated="onUpdated()"
          ></delete-workflow-button>
        </div>
      </div>
      <v-divider></v-divider>
      <v-data-table
        hide-default-header
        hide-default-footer
        :items="items(workflow)"
        :headers="headers"
      >
        <template v-slot:[`item.type`]="{ item }">{{ $t(item.type) }}</template>
        <template v-slot:[`item.elements`]="{ item }">
          <span v-if="!Array.isArray(item.elements)">
            {{ item.elements }}
          </span>
          <div v-else>
            <tr v-for="(element, index) in item.elements" :key="index">
              {{
                element
              }}
            </tr>
          </div>
        </template>
      </v-data-table>
    </v-alert>
    <div class="d-flex col">
      <v-divider></v-divider>
      <insert-workflow-button @updated="onUpdated()"></insert-workflow-button>
      <v-divider></v-divider>
    </div>
  </div>
  <div v-else class="d-flex flex-wrap mr-2">
    <v-btn @click="display = true" color="info" outlined id="show-workflows"
      ><v-icon left>mdi-eye</v-icon>Workflows</v-btn
    >
  </div>
</template>

<script>
import EditWorkflowButton from "./EditWorkflowButton.vue";
import InsertWorkflowButton from "./InsertWorkflowButton.vue";
import DeleteWorkflowButton from "./DeleteWorkflowButton.vue";
export default {
  data() {
    return { workflows: [], display: false };
  },
  computed: {
    headers() {
      return [
        { text: "Type", value: "type" },
        { text: "Elements", value: "elements" }
      ];
    }
  },
  methods: {
    items(workflow) {
      return Object.keys(workflow).map(key => ({
        type: key,
        elements: workflow[key]
      }));
    },
    isMainWorkflow(workflowName) {
      return workflowName == this.currentSurvey.mainWorkflow.name;
    },
    onUpdated() {
      this.loadWorkflows();
    },
    formatHeap(pageSets) {
      return pageSets.map(ps =>
        this.getLabel("mlstring", {}, ps.type, this.$i18n)
      );
    },
    formatSequence(pageSets, sep = " → ") {
      return this.formatHeap(pageSets).join(sep);
    },
    loadWorkflows() {
      this.workflows = this.currentSurvey.workflows.map(w => {
        const initial = w.single.filter(ps => w.sequence.includes(ps));
        const followUp = w.many.filter(ps => w.sequence.includes(ps));
        const auxiliaries = w.many.filter(ps => !w.sequence.includes(ps));
        const all = {
          name: this.getLabel("mlstring", {}, w.name, {
            ...this.$i18n,
            locale: "__code__"
          }),
          synthesis: this.getLabel("mlstring", {}, w.info?.type, this.$i18n),
          initial: this.formatSequence(initial),
          followUp: this.formatSequence(followUp),
          end: this.formatHeap(w.stop),
          auxiliaries: this.formatHeap(auxiliaries),
          notifications: w.notifications
        };
        return this.isMainWorkflow(all.name)
          ? {
              name: all.name,
              synthesis: all.synthesis,
              initial: all.initial,
              followUp: all.followUp,
              end: all.end,
              auxiliaries: all.auxiliaries
            }
          : {
              name: all.name,
              pageSets: [
                all.synthesis,
                all.initial,
                all.followUp,
                all.end.join(","),
                all.auxiliaries.join(",")
              ],
              notifications: all.notifications
            };
      });
    }
  },
  mounted() {
    this.loadWorkflows();
  },
  i18n: {
    messages: {
      en: {
        name: "Name",
        synthesis: "Synthesis",
        start: "Start interview",
        sequence: "Interviews sequence",
        initial: "Initial interviews",
        followUp: "Follow up interviews",
        auxiliaries: "Auxiliary interviews",
        all: "All interviews",
        end: "End interviews",
        pageSets: "Interviews",
        notifications: "Notifications"
      },
      fr: {
        name: "Nom",
        synthesis: "Synthèse",
        start: "Interview de départ",
        sequence: "Déroulement des interviews",
        initial: "Interviews initiales",
        followUp: "Interviews de suivi",
        auxiliaries: "Interviews auxiliaires",
        all: "Toutes les interviews",
        end: "Interviews de fin",
        pageSets: "Interviews",
        notifications: "Notifications"
      }
    }
  },
  components: {
    EditWorkflowButton,
    InsertWorkflowButton,
    DeleteWorkflowButton
  }
};
</script>
