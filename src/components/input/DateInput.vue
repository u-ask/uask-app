<template>
  <component
    :is="inputComponent"
    :disabled="disabled"
    :value="value"
    :labels="labels"
    :showDay="!type.month"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  >
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </component>
</template>

<script>
import IncompleteDateInput from "./IncompleteDateInput";
import CompleteDateInput from "./CompleteDateInput";
export default {
  props: ["type", "value", "disabled", "empty", "labels"],
  computed: {
    inputComponent: function() {
      return this.type.incomplete == true
        ? "incomplete-date-input"
        : "complete-date-input";
    }
  },
  components: {
    IncompleteDateInput,
    CompleteDateInput
  }
};
</script>
