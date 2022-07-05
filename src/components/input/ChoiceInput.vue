<template>
  <div ref="choices">
    <component
      :is="inputComponent"
      :disabled="disabled"
      :value="value"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      :name="name"
      :type="type"
      :stacked="stacked"
      :placeholder="$t('inputText')"
      :compact="compact"
      :expanded="expanded"
      :classes="classes"
      style="font-size=1rem"
    >
      <template v-slot:append>
        <slot name="append"></slot>
      </template>
    </component>
  </div>
</template>

<script>
import SingleChoiceInput from "./SingleChoiceInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
export default {
  props: [
    "type",
    "name",
    "value",
    "disabled",
    "empty",
    "labels",
    "compact",
    "expanded",
    "classes"
  ],
  data() {
    return {
      stacked: false
    };
  },
  computed: {
    inputComponent: function() {
      const multiplicity = this.type.multiplicity;
      var component;
      if (multiplicity == "one") {
        component = "single";
      } else if (multiplicity == "many") {
        component = "multiple";
      } else {
        component = "single";
      }
      return `${component}-choice-input`;
    }
  },
  methods: {
    stackedElements() {
      this.stacked =
        this.$refs.choices.clientHeight >
        2.5 *
          parseInt(
            window.getComputedStyle(document.body).fontSize.substr(0, 2)
          );
    }
  },
  mounted() {
    this.stackedElements();
  },
  i18n: {
    messages: {
      en: {
        inputText: "Choose answer here"
      },
      fr: {
        inputText: "Selectionnez en cliquant ici"
      }
    }
  },
  components: {
    SingleChoiceInput,
    MultipleChoiceInput
  }
};
</script>
