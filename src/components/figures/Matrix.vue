<template>
  <v-data-table :headers="headers" :items="items" dense></v-data-table>
</template>

<script>
export default {
  props: [
    "values",
    "rowIndexes",
    "columnIndexes",
    "title",
    "rowLabel",
    "columnLabel",
    "clickable"
  ],
  computed: {
    headers() {
      return [
        {
          text: this.getLabel("mlstring", {}, this.rowLabel, this.$i18n),
          value: "rowLabels"
        }
      ].concat(
        this.columnIndexes.map(cl => ({
          text: cl?.toString() ?? "undefined",
          value: cl?.toString() ?? "undefined"
        }))
      );
    },
    items() {
      return this.values.map((row, index) => {
        const entries = this.headers.map((h, i) => {
          return i == 0
            ? [h.value, this.rowIndexes[index]]
            : [h.value, row[i - 1]];
        });
        return Object.fromEntries(entries);
      });
    }
  },
  mounted() {
    this.$emit("clickable", false);
  }
};
</script>
