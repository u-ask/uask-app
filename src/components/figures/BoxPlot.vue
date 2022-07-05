<template>
  <apexchart
    type="boxPlot"
    :height="mobile ? '200' : '350'"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
export default {
  props: [
    "values",
    "columnIndexes",
    "rowIndexes",
    "title",
    "columnLabel",
    "rowLabel",
    "clickable"
  ],
  data() {
    return {
      graph: undefined,
      series: undefined
    };
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: "boxPlot",
          height: 350,
          animations: {
            enabled: false
          }
        },
        series: this.series,
        legend: {
          position: "right",
          offsetX: 0,
          offsetY: 50
        },
        xaxis: {
          title: {
            text: this.getLabel("mlstring", {}, this.rowLabel, this.$i18n)
          }
        }
      };
    }
  },
  methods: {
    updateSeries() {
      this.series = [
        {
          data: this.rowIndexes.map((ri, index) => ({
            x: ri,
            y: this.values[index]
          }))
        }
      ];
    }
  },
  mounted() {
    this.graph = this.kpi;
    this.updateSeries();
    this.$emit("clickable", false);
  },
  watch: {
    rowIndexes() {
      this.graph = this.kpi;
      this.updateSeries();
    }
  }
};
</script>
