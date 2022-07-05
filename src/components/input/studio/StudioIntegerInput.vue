<template>
  <studio-multiple-input
    v-if="isStudioScoreInput"
    :value="value"
    :score="true"
    @input="onInput($event)"
    @change="onBlur()"
  ></studio-multiple-input>
  <integer-input
    v-else
    :value="value"
    @input="onInput($event)"
    @change="onBlur()"
  >
  </integer-input>
</template>

<script>
export default {
  props: ["value", "classes"],
  components: {
    StudioMultipleInput: () => import("./StudioMultipleInput.vue"),
    IntegerInput: () => import("../IntegerInput.vue")
  },
  methods: {
    onInput(value) {
      this.$emit("input", this.getValue(value));
      this.hasChanged = true;
    },
    onBlur() {
      if (this.hasChanged) this.$emit("change", this.value);
      this.hasChanged = false;
    },
    getValue(v) {
      return !Array.isArray(v) ? (v != "" ? Number(v) : undefined) : v;
    }
  }
};
</script>
