<template>
  <studio-page-set-selector
    v-if="isStudioPageSetSelector"
    :value="value"
    :classes="classes"
    :type="type"
    @input="onInput($event)"
    @change="onBlur()"
  >
  </studio-page-set-selector>
  <studio-page-selector
    v-else-if="isStudioPageSelector"
    :value="value"
    :classes="classes"
    :type="type"
    @input="onInput($event)"
    @change="onBlur()"
  >
  </studio-page-selector>
</template>

<script>
export default {
  components: {
    StudioPageSelector: () => import("./StudioPageSelector.vue"),
    StudioPageSetSelector: () => import("./StudioPageSetSelector.vue")
  },
  props: ["value", "classes", "type"],
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
