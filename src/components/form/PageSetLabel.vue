<template>
  <span class="overflow-hidden">
    <em class="mr-1">
      <span id="current-interview-date" v-if="interviewDate">
        {{ getLabel("date", [false], interviewDate, $i18n) }}
        <v-icon>mdi-circle-medium</v-icon>
        <lang-label :labels="interviewPageSetType"></lang-label>
      </span>
      <lang-label v-else :labels="interviewPageSetType"></lang-label>
      <status-icon :status="interviewStatus" small></status-icon>
    </em>
  </span>
</template>

<script>
import LangLabel from "../input/LangLabel";
import StatusIcon from "./StatusIcon.vue";

export default {
  props: ["interview"],
  computed: {
    interviewDate() {
      return this.interview?.date;
    },
    interviewPageSetType() {
      return this.interview?.pageSet.type;
    },
    interviewStatus() {
      return this.interview?.status ?? "incomplete";
    }
  },
  components: {
    LangLabel,
    StatusIcon
  }
};
</script>
