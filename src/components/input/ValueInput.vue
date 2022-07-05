<template>
  <component
    :is="inputComponent"
    :disabled="disabled"
    :value="value"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    :name="name"
    :type="type"
    :metadata="metadata"
    :labels="labels"
    :expanded="expanded"
    :classes="classes"
    :multiLang="multiLangClass"
  >
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </component>
</template>

<script>
import TextInput from "./TextInput";
import YesnoInput from "./YesNoInput";
import DateInput from "./DateInput";
import ChoiceInput from "./ChoiceInput";
import GlossaryInput from "./ChoiceInput";
import ScaleInput from "./ScaleInput";
import ScoreInput from "./SingleChoiceInput";
import LangLabel from "./LangLabel";
import IntegerInput from "./IntegerInput";
import RealInput from "./RealInput";
import AcknowledgeInput from "./AcknowledgeInput";
import ImageInput from "./ImageInput.vue";
import TimeInput from "./TimeInput.vue";
import langs from "../../mixin/langs.js";

export default {
  props: [
    "name",
    "labels",
    "type",
    "value",
    "disabled",
    "metadata",
    "expanded",
    "classes"
  ],
  computed: {
    inputComponent: function() {
      if (this.isStudioInput)
        return this.isStudioUnitInput
          ? "studio-unit-input"
          : `studio-${this.type.name}-input`;
      return `${this.type.name}-input`;
    }
  },
  mixins: [langs],
  components: {
    TextInput,
    YesnoInput,
    DateInput,
    ChoiceInput,
    GlossaryInput,
    ScaleInput,
    ScoreInput,
    LangLabel,
    IntegerInput,
    RealInput,
    AcknowledgeInput,
    ImageInput,
    TimeInput,
    StudioTextInput: () => import("./studio/StudioTextInput.vue"),
    StudioIntegerInput: () => import("./studio/StudioIntegerInput.vue"),
    StudioUnitInput: () => import("./studio/StudioUnitInput.vue"),
    StudioChoiceInput: () => import("./studio/StudioChoiceInput.vue"),
    StudioGlossaryInput: () => import("./studio/StudioChoiceInput.vue")
  }
};
</script>
