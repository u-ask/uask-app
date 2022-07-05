<template>
  <div>
    <div class="d-flex align-center pt-1">
      <lang-label
        :class="{ 'mr-3 py-0 pa-5 text-dark': !mobile, 'pl-1': mobile }"
        :labels="wording"
      ></lang-label>
      <v-divider vertical class="mx-2"></v-divider>
      {{ $t("byperiod") }}
      <acknowledge-input
        class="ml-1"
        :id="`input-criteria-date-filter-${name}`"
        :value="byPeriod"
        @change="onChange($event)"
      ></acknowledge-input>
    </div>
    <template v-if="!byPeriod">
      <span class="d-flex align-center">
        <simple-item-input
          class="col"
          :id="`input-date-precise-${name}`"
          :name="name"
          :type="incompleteDateType"
          :value="value"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          :disabled="disabled"
        >
        </simple-item-input>
        <slot name="append"></slot>
      </span>
    </template>
    <template v-else>
      <period-filter
        :wording="wording"
        :name="name"
        :type="incompleteDateType"
        :value="value"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
      ></period-filter>
    </template>
  </div>
</template>

<script>
import SimpleItemInput from "../form/SimpleItemInput.vue";
import AcknowledgeInput from "../input/AcknowledgeInput.vue";
import LangLabel from "../input/LangLabel.vue";
import PeriodFilter from "./PeriodFilter.vue";
export default {
  components: { SimpleItemInput, PeriodFilter, LangLabel, AcknowledgeInput },
  props: ["name", "wording", "type", "value", "disabled"],
  data() {
    return {
      byPeriod: false
    };
  },
  computed: {
    incompleteDateType() {
      return { name: "date", incomplete: true, month: this.type.month == true };
    }
  },
  methods: {
    onChange(value) {
      this.byPeriod = value;
      this.$emit("input", undefined);
      this.$emit("change", undefined);
    },
    loadFilter() {
      this.byPeriod = typeof this.value != "string" && this.value !== undefined;
    }
  },
  mounted() {
    this.loadFilter();
  },
  i18n: {
    messages: {
      en: {
        period: "By period",
        precise: "By precise date",
        byperiod: "By period"
      },
      fr: {
        period: "Par période",
        precise: "Par date précise",
        byperiod: "Par période"
      }
    }
  }
};
</script>
