<template>
  <order-input
    :value="value"
    :options="items"
    :multiplicity="type.multiplicity"
    :classes="classes"
    @input="$emit('input', $event)"
  ></order-input>
</template>

<script>
import { getTranslation } from "uask-dom";
import OrderInput from "./OrderInput.vue";

export default {
  components: { OrderInput },
  props: ["value", "classes", "type"],
  computed: {
    items() {
      return this.type.labels.map(l => ({
        text: this.getLabel("mlstring", {}, l, this.$i18n),
        value: getTranslation(l, "__code__")
      }));
    }
  }
};
</script>
