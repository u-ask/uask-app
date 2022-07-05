<template>
  <v-container
    fluid
    class="d-md-inline-flex align-center justify-center flex-wrap "
    :class="{ 'd-flex px-0 col-6': mobile, col: !mobile }"
  >
    <apexchart
      v-for="(row, index) in filterValues"
      :key="rowIndexes[index]"
      type="pie"
      :height="mobile ? '200' : '350'"
      :options="chartOptions(index)"
      :series="row"
      class="col-md-4 col-6"
    ></apexchart>
  </v-container>
</template>

<script>
export default {
  props: [
    "kpi",
    "values",
    "columnIndexes",
    "rowIndexes",
    "title",
    "columnLabel",
    "rowLabel",
    "rowSums",
    "rowSource",
    "columnSource",
    "kpiName",
    "clickable"
  ],
  data() {
    return {
      graph: undefined
    };
  },
  computed: {
    filterValues() {
      return this.values.filter((row, index) => this.rowSums[index] != 0);
    }
  },
  methods: {
    chartOptions(index) {
      const columnIndexes = this.columnIndexes;
      const rowIndexes = this.rowIndexes;
      const columnSource = this.columnSource;
      const rowSource = this.rowSource;
      const router = this.$router;
      const kpiName = this.kpiName;
      return {
        labels: this.columnIndexes.map(
          ci => this.getLabel("mlstring", {}, ci, this.$i18n) ?? "undefined"
        ),
        chart: {
          type: "pie",
          height: this.mobile ? 200 : 350,
          stacked: true,
          width: "100%",
          animations: {
            enabled: false
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              if (this.clickable)
                router.push({
                  name:
                    kpiName == "QueriesBySamples"
                      ? "View alerts"
                      : "Search participant",
                  query: {
                    ...(columnIndexes[config.dataPointIndex] != "all"
                      ? { [columnSource]: columnIndexes[config.dataPointIndex] }
                      : { [columnSource]: undefined }),
                    ...(rowIndexes[index] != "all"
                      ? { [rowSource]: rowIndexes[index] }
                      : { [columnSource]: undefined })
                  }
                });
            }
          }
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -15
            }
          }
        },
        title: {
          text: this.rowIndexes[index]
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        legend: {
          position: "top",
          offsetX: 0,
          offsetY: 0
        }
      };
    }
  },
  mounted() {
    this.graph = this.kpi;
    this.$emit("clickable", true);
  }
};
</script>
