<template>
  <div>
    <div
      v-for="(filter, ix) in filterValues"
      :key="ix"
      :class="{
        'mb-2 border rounded p-2': mobile,
        'border rounded mb-2': !mobile
      }"
    >
      <component
        :is="isDateType(filter)"
        :id="`input-group-${filter.pin.variableName}`"
        :wording="getLabel('mlstring', {}, filter.pin.pin, $i18n)"
        :name="filter.pin.variableName"
        :type="filter.pin.type"
        :value="checkIfUndefinedValue(filter.value)"
        @input="onEvent(ix, $event)"
        @change="onEvent(ix, $event)"
        :disabled="filter.value === 'undefined'"
      >
        <template v-slot:append>
          <clear-control
            v-if="filter.value !== 'undefined'"
            :name="filter.pin.variableName"
            @clear="onEvent(ix, undefined)"
          ></clear-control>
          <empty-input
            v-if="!mobile"
            :name="filter.pin.variableName"
            :value="filter.value"
            @change="onEvent(ix, $event)"
          ></empty-input>
        </template>
      </component>
      <empty-input
        v-if="mobile"
        :name="filter.pin.variableName"
        :value="filter.value"
        @change="onEvent(ix, $event)"
      ></empty-input>
    </div>
  </div>
</template>

<script>
import SimpleItemInput from "../form/SimpleItemInput";
import ClearControl from "../input/ClearControl.vue";
import EmptyInput from "../input/EmptyInput.vue";
import DateFilter from "./DateFilter.vue";

export default {
  data() {
    return {
      filterValues: []
    };
  },
  methods: {
    onEvent(ix, value) {
      const pin = this.currentSurvey.pins[ix];
      this.updateFilter(pin, value);
      this.sendFilter(pin, value ?? undefined);
      Object.assign(this.filterValues[ix], { value });
    },
    updateFilter(pin, value) {
      const { name: typeName, ...args } = pin.type;
      const query = {
        ...this.$route.query,
        [pin.variableName]: this.getLabel(typeName, args, value, this.$i18n)
      };
      this.$router.replace({ query });
    },
    sendFilter(pin, value) {
      const filter = "value" in pin ? pin : { pin, value };
      this.$emit("input", filter);
    },
    value(pin) {
      const value = this.$route.query[pin.variableName];
      const { name: typeName, ...args } = pin.type;
      return this.itemToValue(typeName, value, args);
    },
    loadFilters() {
      this.filterValues = [];
      for (const pin of this.currentSurvey.pins) {
        const filter = {
          pin: pin,
          value: this.value(pin)
        };
        if (filter.value) this.sendFilter(filter);
        this.filterValues.push(filter);
      }
    },
    checkIfUndefinedValue(value) {
      return value === "undefined" ? undefined : value;
    },
    isDateType(filter) {
      return filter.pin.type.name == "date"
        ? "date-filter"
        : "simple-item-input";
    }
  },
  mounted() {
    this.loadFilters();
  },
  components: {
    SimpleItemInput,
    ClearControl,
    EmptyInput,
    DateFilter
  }
};
</script>
