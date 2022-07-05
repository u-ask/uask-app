<template>
  <v-radio-group
    :disabled="disabled"
    :name="'YesNo' + name"
    :value="checked"
    @change="$emit('change', getValue($event))"
    row
  >
    <v-radio value="Yes" :label="$t('yes')"></v-radio>
    <v-radio value="No" :label="$t('no')"></v-radio>
    <span slot="append">
      <slot name="append"></slot>
    </span>
  </v-radio-group>
</template>

<script>
export default {
  props: ["name", "value", "disabled"],
  computed: {
    checked: function() {
      return this.value === undefined ? undefined : this.value ? "Yes" : "No";
    }
  },
  methods: {
    getValue(v) {
      return v == "Yes" ? 1 : 0;
    }
  },
  i18n: {
    messages: {
      en: { yes: "Yes", no: "No" },
      fr: { yes: "Oui", no: "Non" }
    }
  }
};
</script>

<style>
.v-input--selection-controls {
  margin-top: 0px !important;
}
</style>
