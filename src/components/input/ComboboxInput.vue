<template>
  <v-combobox
    :items="options"
    :value="value"
    :label="label"
    :placeholder="placeholder"
    @input="$emit('input', getValue($event))"
    @change="$emit('change', getValue($event))"
    clearable
    :multiple="multiple"
    :chips="chips"
    :return-object="false"
    :disabled="disabled"
  >
    <template v-if="chips" v-slot:selection="data">
      <v-chip>{{ displayText(data.item) }}</v-chip>
    </template>
  </v-combobox>
</template>

<script>
export default {
  props: [
    "value",
    "options",
    "label",
    "placeholder",
    "multiple",
    "chips",
    "disabled"
  ],
  methods: {
    displayText(item) {
      return this.options.find(e => e.value == item)?.text;
    },
    getValue(v) {
      return v == null ? undefined : v;
    }
  }
};
</script>
