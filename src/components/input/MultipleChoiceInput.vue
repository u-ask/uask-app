<template>
  <div>
    <v-combobox
      v-if="($vuetify.breakpoint.mobile && !expanded) || compact"
      :name="name"
      :items="choices"
      :disabled="disabled"
      :value="values"
      :readonly="readonly"
      :label="label"
      @change="send"
      :return-object="false"
      clearable
      multiple
      chips
    >
      <template v-slot:selection="data">
        <v-chip
          :key="data.item"
          :outlined="chipsOutlined"
          :color="chipsColor ? chipsColor : 'primary'"
          >{{ displayText(data.item) }}</v-chip
        >
      </template>
    </v-combobox>
    <div
      v-else-if="(!$vuetify.breakpoint.mobile && !compact) || expanded"
      :name="name"
      class="d-inline-flex"
    >
      <v-radio-group :readonly="readonly" :row="row">
        <v-checkbox
          v-for="(choice, index) in choices"
          :key="index"
          :disabled="disabled"
          :label="choice.text ? choice.text : choice"
          :true-value="true"
          :false-value="false"
          :value-comparator="
            () => {
              return values
                ? values.includes(choice.value ? choice.value : choice)
                : false;
            }
          "
          @change="checkboxChanged(choice, $event)"
          class="mr-4"
          :row="row"
        ></v-checkbox>
      </v-radio-group>
      <slot name="append"></slot>
    </div>
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
    "compact",
    "expanded",
    "readonly",
    "chipsColor",
    "chipsOutlined",
    "classes"
  ],
  data() {
    return {
      selectedCheckbox: undefined
    };
  },
  computed: {
    values() {
      return this.value ? [...this.value] : [];
    },
    checked: function() {
      if (typeof this.values === "string") {
        const tabValue = [this.values];
        return tabValue;
      }
      return this.values;
    },
    choices: function() {
      return this.type.choices != undefined
        ? this.type.labels?.map((l, i) => ({
            value: this.type.choices[i],
            text: this.getLabel("mlstring", {}, l, this.$i18n)
          }))
        : this.type;
    },
    row: function() {
      if (this.classes?.includes("row")) return true;
      else if (this.classes?.includes("column")) return false;
      else return !this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    send(options) {
      const value =
        Array.isArray(options) && options?.length == 0 ? undefined : options;
      this.$emit("change", value);
    },
    displayText(item) {
      return this.choices?.find(e => e.value == item)?.text ?? item;
    },
    checkboxChanged(value, selected) {
      selected
        ? this.selectedCheckbox.push(value.value ? value.value : value)
        : (this.selectedCheckbox = this.selectedCheckbox.filter(
            v => v != value && v != value.value
          ));
      this.send(this.selectedCheckbox);
    }
  },
  mounted() {
    this.selectedCheckbox = this.values ?? [];
  },
  watch: {
    value(val) {
      if (val == undefined) this.selectedCheckbox = [];
    }
  }
};
</script>
