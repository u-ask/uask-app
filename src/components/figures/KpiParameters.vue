<template>
  <div>
    <div v-if="clickable && !mobile">
      <v-badge color="success" overlap left content="click the graph !">
        <v-autocomplete
          dense
          outlined
          :items="choices"
          :value="display"
          @input="$emit('graph', $event)"
          hide-details
        ></v-autocomplete>
      </v-badge>
    </div>
    <v-autocomplete
      v-else
      dense
      outlined
      :items="choices"
      :value="display"
      @input="$emit('graph', $event)"
      hide-details
    ></v-autocomplete>
  </div>
</template>

<script>
export default {
  props: ["display", "options", "clickable"],
  computed: {
    choices() {
      return [
        { text: this.$t("table"), value: "matrix" },
        { text: this.$t("histogram"), value: "histogram" },
        { text: this.$t("pie"), value: "pies" },
        { text: this.$t("boxPlot"), value: "boxPlot" },
        { text: this.$t("histogramTimeSeries"), value: "histogramTimeSeries" },
        { text: this.$t("lineTimeSeries"), value: "lineTimeSeries" }
      ].filter(el => this.options.types.includes(el.value));
    }
  },
  i18n: {
    messages: {
      en: {
        table: "Table",
        histogram: "Histogram",
        pie: "Pie",
        boxPlot: "Box Plot",
        histogramTimeSeries: "Time Series (Histogram)",
        lineTimeSeries: "Time Series (Line)",
        graphTypes: "Graph type"
      },
      fr: {
        table: "Tableau",
        histogram: "Histogramme",
        pie: "Camembert",
        boxPlot: "Boite à moustache",
        histogramTimeSeries: "Series temporelles (Histogramme)",
        lineTimeSeries: "Series temporelles (Courbe)",
        graphTypes: "Type de représentation"
      }
    }
  }
};
</script>
