<template>
  <v-text-field
    :value="currentValue"
    :disabled="disabled"
    :placeholder="$t('placeholder', placeholder)"
    @blur="onBlur()"
    @input="onInput($event)"
    @keypress="onlyNumbers($event)"
    ref="input"
  >
    <span slot="append">
      <slot name="append"></slot>
    </span>
  </v-text-field>
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
  data() {
    return {
      currentValue: undefined
    };
  },
  props: ["value", "disabled", "metadata"],
  computed: {
    hasPrecision() {
      return !!this.metadata?.precision;
    },
    precision() {
      return this.metadata?.precision;
    },
    placeholder() {
      const range =
        this.metadata?.min != undefined && this.metadata?.max != undefined
          ? `${this.$t("valueIn")} ${this.metadata.range}`
          : undefined;
      const precision = this.metadata?.precision
        ? `${this.$t("precision")} ${this.metadata?.precision} ${this.$tc(
            "digits",
            this.metadata?.precision
          )}`
        : undefined;
      return this.joinMessages(range, precision);
    }
  },
  methods: {
    onlyNumbers(ev) {
      if (!/[\d.,+-]/.test(ev.key)) {
        ev.preventDefault();
      }
      const newValue = this.format(this.currentValue + ev.key);
      if (newValue == this.currentValue) {
        ev.preventDefault();
      }
    },
    onInput(value) {
      this.currentValue = this.format(value);
      const v = this.getValue(this.currentValue);
      if (this.value != v) {
        this.$emit("input", v);
        this.hasChanged = true;
      }
    },
    onBlur() {
      if (this.hasChanged) this.$emit("change", this.value);
      this.hasChanged = false;
    },
    getValue(v) {
      return v != "" ? Number(v) : undefined;
    },
    format(value) {
      if (!this.hasPrecision) return value;
      const rexp = new RegExp(`[,.]([0-9]{0,${this.precision}}).*`);
      return value.replace(rexp, ".$1");
    },
    setCurrent() {
      this.currentValue = this.value ? String(this.value) : undefined;
    }
  },
  watch: {
    value: function() {
      if (this.value != this.getValue(this.currentValue)) this.setCurrent();
    }
  },
  created() {
    this.setCurrent();
  },
  i18n: {
    messages: {
      en: {
        placeholder: "decimal number {0}",
        valueIn: "in",
        precision: "precision",
        digits: "digit | digits"
      },
      fr: {
        placeholder: "nombre décimal {0}",
        valueIn: "dans",
        precision: "précision",
        digits: "chiffre | chiffres"
      }
    }
  }
};
</script>
