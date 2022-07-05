<template>
  <studio-multiple-input
    :value="value"
    :score="false"
    :unit="true"
    @input="onInput($event)"
    @change="onChange()"
  ></studio-multiple-input>
</template>

<script>
export default {
  components: {
    StudioMultipleInput: () => import("./StudioMultipleInput.vue")
  },
  props: ["value"],
  methods: {
    onInput(value) {
      this.$emit("input", this.getValue(value));
      this.hasChanged = true;
    },
    onChange() {
      if (this.hasChanged) this.$emit("change", this.value);
      this.hasChanged = false;
    },
    getValue(v) {
      return v != "" ? v : undefined;
    }
  }
};
</script>
