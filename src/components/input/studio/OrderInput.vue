<template>
  <v-autocomplete
    :value="multiple && value ? [...value] : value"
    :items="options"
    :multiple="multiple"
    @change="changeValue($event)"
  >
    <template v-slot:selection="data">
      <v-chip v-if="multiple" color="primary">
        <v-icon v-if="ordering" left @click="move(data.item, -1)">
          mdi-chevron-left
        </v-icon>
        {{ data.item.text }}
        <v-icon v-if="ordering" right @click="move(data.item, 1)">
          mdi-chevron-right
        </v-icon>
        <v-icon right @click="remove(data.item)">
          mdi-close-circle
        </v-icon>
      </v-chip>
      <span v-else>{{ data.item.text }}</span>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: ["value", "options", "classes", "multiplicity"],
  computed: {
    ordering() {
      return !this.classes?.includes("no-ordering");
    },
    multiple() {
      return this.isMultiple || this.multiplicity == "many";
    }
  },
  methods: {
    move(item, direction) {
      const tabValue = [...this.value];
      const index = tabValue.indexOf(item.value);
      tabValue.splice(index, 1);
      tabValue.splice(index + direction, 0, item.value);
      this.$emit("input", tabValue);
    },
    remove(item) {
      const tabValue = [...this.value];
      const index = tabValue.indexOf(item.value);
      tabValue.splice(index, 1);
      this.$emit("input", tabValue);
    },
    changeValue(event) {
      this.$emit("input", event);
    }
  }
};
</script>
