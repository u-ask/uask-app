<template>
  <div v-show="!pendingStudioModification">
    <div class="d-flex mb-8 flex-wrap col-12 px-0">
      <survey-options-synthesis v-if="isStudioMode"></survey-options-synthesis>
      <workflows-syntesis v-if="isStudioMode"></workflows-syntesis>
    </div>
    <delete-manager
      v-if="canDelete"
      participant
      class="float-right"
      @delete="onDelete($event)"
    ></delete-manager>
    <h4>{{ $t("interviews") }}</h4>
    <v-divider class="mt-0"></v-divider>
    <v-alert
      v-for="(pigroup, index) in groupedPageSet"
      :key="index"
      :id="getLabel('mlstring', {}, pigroup.pageSet.type, $i18n)"
      border="left"
      elevation="1"
      color="success"
      colored-border
      :class="['my-4 dashboardcard_' + index]"
    >
      <v-card elevation="0">
        <v-card-text>
          <pageset-summary
            :interviews="pigroup.interviews"
            :singlePage="pigroup.pageSet.pages.length == 1"
            @delete="onDelete($event)"
          >
            <template v-slot:title>
              <v-card flat>
                <v-card-title
                  @click="goToLastInterview(pigroup)"
                  class="link-title"
                  :id="
                    'synth-' +
                      getLabel('mlstring', {}, pigroup.pageSet.type, {
                        ...$i18n,
                        locale: '__code__'
                      })
                  "
                >
                  <strong>
                    {{ getLabel("mlstring", {}, pigroup.pageSet.type, $i18n) }}
                  </strong>
                </v-card-title>
                <v-card-text
                  v-if="isInterview(pigroup.pageSet) && !isOne(pigroup.pageSet)"
                  class="nbrInterviews py-0"
                >
                  {{ $t("nbrInterviews") }} :
                  <strong>{{ pigroup.interviews.length }}</strong>
                </v-card-text>
              </v-card>
            </template>
          </pageset-summary>
        </v-card-text>
      </v-card>
    </v-alert>
  </div>
</template>

<script>
import { groupByPageSet } from "uask-dom";
import PagesetSummary from "./PagesetSummary";
import WorkflowsSyntesis from "../studio/WorkflowSynthesis.vue";
import SurveyOptionsSynthesis from "../studio/SurveyOptionsSynthesis.vue";
import DeleteManager from "../participant/DeleteManager.vue";

export default {
  computed: {
    groupedPageSet() {
      return groupByPageSet(
        this.currentParticipant
          .availableInterviews(this.currentWorkflow)
          .filter(el => el.pageSet != this.currentWorkflow.info)
      );
    },
    canDelete() {
      return !this.isStudioMode && this.authorizationManager.canDelete();
    }
  },
  methods: {
    isInterview(pageSet) {
      return (
        this.currentSurvey.mainWorkflow.many.includes(pageSet) ||
        (this.currentSurvey.mainWorkflow.single.includes(pageSet) &&
          !this.isFirst(pageSet))
      );
    },
    isOne(pageSet) {
      return this.currentSurvey.mainWorkflow.single.includes(pageSet);
    },
    isFirst(pageSet) {
      return this.currentSurvey.mainWorkflow.sequence[0] == pageSet;
    },
    goToLastInterview(pigroup) {
      const interview =
        this.currentParticipant.interviews.findIndex(
          i => i == pigroup.interviews.last
        ) + 1;
      this.$router.push({
        query: {
          interview: interview
        }
      });
    },
    onDelete({ participant }) {
      if (participant)
        this.$router.push({
          name: "Search participant"
        });
    }
  },
  components: {
    PagesetSummary,
    WorkflowsSyntesis,
    DeleteManager,
    SurveyOptionsSynthesis
  },
  i18n: {
    messages: {
      en: {
        nbrInterviews: "Total count",
        lastDate: "Last date",
        noDate: "No date",
        interviews: "Interviews"
      },
      fr: {
        nbrInterviews: "Nombre total",
        lastDate: "Dernière date ",
        noDate: "Non daté",
        interviews: "Interviews"
      }
    }
  }
};
</script>

<style>
.link-title {
  cursor: pointer;
}

.link-title:hover {
  background-color: #f2f3f8;
}
</style>
