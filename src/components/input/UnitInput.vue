<template>
  <div class="ml-1 d-flex align-center">
    <template>
      <component
        :is="component"
        :value="selectValue"
        :items="units"
        :disabled="disabled"
        class="unit"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
      ></component>
    </template>
  </div>
</template>

<script>
export default {
  props: ["units", "value", "disabled", "isExtendable"],
  computed: {
    component() {
      return this.isExtendable ? "v-combobox" : "v-select";
    },
    selectValue() {
      return this.units.length == 1 && this.value == undefined
        ? this.units[0]
        : this.value;
    }
  },
  created() {
    if (
      this.value == undefined &&
      this.units.length == 1 &&
      this.disabled == false
    )
      this.$emit("change", this.units[0]);
  }
};
</script>
