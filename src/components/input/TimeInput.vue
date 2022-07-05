<template>
  <div>
    <duration-input
      v-if="type.duration"
      :disabled="disabled"
      :value="value"
      @change="$emit('change', $event)"
    ></duration-input>
    <time-picker-input
      v-else
      :disabled="disabled"
      :value="value"
      @change="$emit('change', $event)"
    ></time-picker-input>
  </div>
</template>

<script>
import DurationInput from "./DurationInput.vue";
import TimePickerInput from "./TimePickerInput.vue";
export default {
  props: ["type", "value", "disabled"],
  components: { DurationInput, TimePickerInput }
};
</script>
