<template>
  <div>
    <div
      v-for="(val, index) in values"
      :key="index"
      class="d-flex align-center col"
    >
      <div class="d-flex flex-row-reverse align-center">
        <div :id="`order-choice-${index}`" class="d-flex flex-column">
          <v-icon v-if="index > 0" @click="move(index, -1)">
            mdi-chevron-up
          </v-icon>
          <v-icon v-if="index < values.length - 1" @click="move(index, +1)">
            mdi-chevron-down
          </v-icon>
        </div>
        <div class="mr-3 py-0">
          {{ index }}
        </div>
        <v-icon
          v-if="values.length > 1"
          class="mr-2"
          color="danger"
          @click="removeInput(index)"
          >mdi-minus-circle
        </v-icon>
      </div>
      <v-divider vertical class="align-self-center"></v-divider>
      <div class="ml-3 py-0 col">
        <component
          v-if="!isUnit && !noCode"
          :is="isScore"
          :label="variableNameClass ? $t('variableName') : 'Code'"
          :name="`code-${index}`"
          :key="`code-${index}`"
          :classes="classes"
          :value="score ? val.score : val.name"
          @input="
            score ? updateScore(index, $event) : updateName(index, $event)
          "
          @change="sendValue('change')"
        ></component>
        <text-input
          :label="!isUnit ? 'Label' : ''"
          :value="!isUnit ? val.label : val"
          :name="`label-${index}`"
          :key="`label-${index}`"
          @input="
            !isUnit ? updateLabel(index, $event) : updateUnit(index, $event)
          "
          @change="sendValue('change')"
          :classes="classes"
        >
        </text-input>
      </div>
    </div>
    <div class="d-flex flex-row-reverse col mt-3">
      <v-icon class="mr-2" color="success" @click="addInput()"
        >mdi-plus-circle
      </v-icon>
    </div>
  </div>
</template>

<script>
import langs from "../../../mixin/langs.js";

export default {
  components: {
    TextInput: () => import("../TextInput.vue"),
    IntegerInput: () => import("../IntegerInput.vue")
  },
  props: { value: {}, score: {}, classes: {}, unit: { default: false } },
  data() {
    return {
      values: []
    };
  },
  computed: {
    isScore() {
      return this.score ? "integer-input" : "text-input";
    },
    isUnit() {
      return this.unit ? true : false;
    },
    variableNameClass() {
      return this.classes?.includes("variableName");
    }
  },
  methods: {
    addInput() {
      const emptyValue = !this.isUnit
        ? this.langs.reduce(
            (acc, lang) => {
              acc.label[lang.value] = "";
              return acc;
            },
            this.isScore ? { score: 0, label: {} } : { name: "", label: {} }
          )
        : undefined;
      this.values.push(emptyValue);
    },
    removeInput(index) {
      this.values.splice(index, 1);
    },
    updateName(index, name) {
      this.values[index].name = name;
      this.sendValue("input");
    },
    updateScore(index, score) {
      this.values[index].score = score;
      this.sendValue("input");
    },
    updateLabel(index, label) {
      this.values[index].label = label;
      this.sendValue("input");
    },
    updateUnit(index, value) {
      this.values[index] = value;
      this.sendValue("input");
    },
    sendValue(event) {
      this.$emit(event, this.values);
    },
    move(index, direction) {
      const element = this.values[index];
      const newIndex = index + direction;
      this.values.splice(index, 1);
      this.values.splice(newIndex, 0, element);
    }
  },
  created() {
    if (this.value && Array.isArray(this.value)) {
      this.values = this.value;
    } else {
      this.addInput();
    }
  },
  mixins: [langs],
  i18n: {
    messages: {
      en: {
        variableName: "Variable name"
      },
      fr: {
        variableName: "Nom de variable"
      }
    }
  }
};
</script>

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
