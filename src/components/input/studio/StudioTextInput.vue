<template>
  <studio-multiple-input
    v-if="isStudioChoiceInput"
    :value="value"
    :classes="classes"
    @input="onInput($event)"
    @change="onBlur()"
  ></studio-multiple-input>
  <studio-lang-selector
    v-else-if="isStudioLangSelector"
    :value="value"
    :classes="classes"
    @input="onInput($event)"
    @change="onBlur()"
  ></studio-lang-selector>
  <text-input
    v-else
    :value="value"
    :classes="classes"
    @input="onInput($event)"
    @change="onBlur()"
  >
  </text-input>
</template>

<script>
export default {
  components: {
    StudioMultipleInput: () => import("./StudioMultipleInput.vue"),
    TextInput: () => import("../TextInput.vue"),
    StudioLangSelector: () => import("./StudioLangSelector.vue")
  },
  props: ["value", "classes"],
  methods: {
    onInput(value) {
      value = this.getValue(value);
      if (!Array.isArray(value) && this.multipleLanguages) {
        value = Object.assign({}, this.value, { [this.langSelected]: value });
      }
      this.$emit("input", value);
      this.hasChanged = true;
    },
    onBlur() {
      if (this.hasChanged) this.$emit("change", this.value);
      this.hasChanged = false;
    },
    getValue(v) {
      return v != "" ? v : undefined;
    }
  }
};
</script>

<style></style>
