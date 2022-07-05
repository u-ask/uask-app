<template>
  <div class="d-md-flex">
    <lang-input
      v-if="multiLang"
      class="mr-2 col-md-2"
      :langsAvailables="langs"
      :value="langSelected"
      @changeLang="onChangeLang($event)"
    ></lang-input>
    <component
      :is="inputComponent"
      :value="itemValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="$t('placeholder', placeholder)"
      @input="onInput($event)"
      @blur="onBlur()"
      :outlined="isFormula"
      :hide-details="isFormula"
      :label="label"
      :rules="type == 'email' ? [rules.email] : []"
      :class="{ 'formula-font': isFormula, 'my-0 py-0': mobile }"
    >
      <span slot="append"> <slot name="append"></slot> </span>
    </component>
  </div>
</template>
<script>
import { isML, getTranslation } from "uask-dom";
import LangInput from "./LangInput.vue";
import langs from "../../mixin/langs.js";

export default {
  props: [
    "value",
    "type",
    "disabled",
    "metadata",
    "label",
    "readonly",
    "classes"
  ],
  data() {
    return {
      hasChanged: false,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      langSelected: this.$i18n.locale
    };
  },
  computed: {
    inputComponent() {
      return this.isMultiline ? "v-textarea" : "v-text-field";
    },
    placeholder() {
      const length = this.metadata?.maxLength
        ? `max ${this.metadata.maxLength} ${this.$t("char")}.`
        : this.metadata?.fixedLength
        ? `exactly ${this.metadata.fixedLength} ${this.$t("char")}.`
        : undefined;
      return this.joinMessages(length);
    },
    itemValue() {
      return getTranslation(this.value, this.langSelected);
    },
    multiLang() {
      return (this.multiLangClass || isML(this.value)) && this.langs.length > 1;
    },
    isFormula() {
      return !!this.classes?.includes("formula");
    },
    isMultiline() {
      return !!this.classes?.includes("multiline");
    }
  },
  methods: {
    onInput(value) {
      value = this.getValue(value);
      if (!Array.isArray(value) && this.multiLang) {
        value = Object.assign({}, this.value, { [this.langSelected]: value });
      }
      this.sendValue("input", value);
      this.hasChanged = true;
    },
    onBlur() {
      if (this.hasChanged) this.sendValue("change", this.value);
      this.hasChanged = false;
    },
    getValue(v) {
      return v != "" ? v : undefined;
    },
    onChangeLang(lang) {
      this.langSelected = lang;
    },
    sendValue(event, value) {
      if (!Array.isArray(value) && this.multiLang) {
        value = this.langs.reduce((res, l) => {
          const lang = l.value;
          res[lang] = value[lang] ?? " ";
          return res;
        }, {});
      }
      this.$emit(event, value);
    }
  },
  mixins: [langs],
  components: { LangInput },
  i18n: {
    messages: {
      en: { placeholder: "text {0}", char: "char" },
      fr: { placeholder: "texte {0}", char: "car" }
    }
  }
};
</script>
<style>
.formula-font input {
  font-family: Arial, Helvetica, sans-serif !important;
}
</style>
