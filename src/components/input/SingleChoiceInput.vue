<template>
  <div>
    <v-radio-group
      v-if="!glossary"
      :items="choices"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="checked"
      @change="send($event)"
      :row="row"
    >
      <v-radio
        v-for="(item, index) in options"
        :key="index"
        :label="item.text"
        :value="item.value"
      ></v-radio>
      <span slot="append">
        <slot name="append"></slot>
      </span>
    </v-radio-group>
    <v-combobox
      v-if="glossary"
      :items="choices"
      :label="label"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="checked"
      @change="send($event)"
      :return-object="false"
      :clearable="clearable"
    >
      <template v-slot:selection="data">
        {{ displayText(data.item) }}
      </template>
      <span slot="append">
        <slot name="append"></slot>
      </span>
    </v-combobox>
  </div>
</template>

<script>
export default {
  props: [
    "value",
    "disabled",
    "name",
    "type",
    "label",
    "stacked",
    "placeholder",
    "compact",
    "expanded",
    "clearable",
    "classes"
  ],
  computed: {
    options: function() {
      return this.type.name == "scale"
        ? this.scaleOptions
        : this.type.name == "score"
        ? this.scoreOptions
        : this.textOptions;
    },
    scaleOptions: function() {
      return this.type.labels?.map((_, i) => ({
        value: this.min + i,
        text: this.getLabel("mlstring", {}, this.type.labels[i], this.$i18n)
      }));
    },
    scoreOptions: function() {
      return this.type.scores?.map((s, i) => ({
        value: s,
        text: this.getLabel(
          "mlstring",
          {},
          this.type.labels?.[i] ?? s,
          this.$i18n
        )
      }));
    },
    textOptions: function() {
      return this.type.choices?.map((value, i) => ({
        value,
        text: this.getLabel("mlstring", {}, this.type.labels[i], this.$i18n)
      }));
    },
    checked: function() {
      return this.value === undefined ? undefined : this.value;
    },
    choices: function() {
      return this.options ?? this.type;
    },
    glossary: function() {
      return this.type.name == "glossary" || this.compact;
    },
    row: function() {
      if (this.classes?.includes("row")) return true;
      else if (this.classes?.includes("column")) return false;
      else return !this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    displayText(item) {
      const foundItem = this.choices?.find(e => e.value == item);
      return foundItem ? foundItem.text : item;
    },
    send(value) {
      const v = this.itemToValue(this.type.name, value);
      this.$emit("change", v);
    }
  }
};
</script>

<style>
label {
  margin-bottom: 0px;
  color: rgba(0, 0, 0, 0.87);
}
</style>
