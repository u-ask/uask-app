<template>
  <div>
    <v-text-field
      type="number"
      :value="value"
      :disabled="disabled"
      :placeholder="$t('placeholder', placeholder)"
      @input="onInput($event)"
      @blur="onBlur()"
      @keypress="onlyNumbers($event)"
    >
      <span slot="append"> <slot name="append"></slot> </span>
    </v-text-field>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<script>
export default {
  props: ["value", "disabled", "metadata", "classes"],
  data() {
    return {
      hasChanged: false
    };
  },
  computed: {
    placeholder() {
      const range =
        this.metadata?.min != undefined && this.metadata?.max != undefined
          ? `${this.$t("valueIn")} ${this.metadata.range}`
          : undefined;
      return this.joinMessages(range);
    }
  },
  methods: {
    onlyNumbers(ev) {
      if (!/[\d+-]/.test(ev.key)) {
        ev.preventDefault();
      }
    },
    onInput(value) {
      this.$emit("input", this.getValue(value));
      this.hasChanged = true;
    },
    onBlur() {
      if (this.hasChanged) this.$emit("change", this.value);
      this.hasChanged = false;
    },
    getValue(v) {
      return v != "" ? Number(v) : undefined;
    }
  },
  i18n: {
    messages: {
      en: { placeholder: "whole number {0}", valueIn: "in" },
      fr: {
        placeholder: "nombre entier {0}",
        valueIn: "dans"
      }
    }
  }
};
</script>
