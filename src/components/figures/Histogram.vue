<template>
  <apexchart
    type="bar"
    :height="mobile ? '200' : '350'"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
export default {
  props: [
    "kpiName",
    "kpi",
    "values",
    "columnIndexes",
    "rowIndexes",
    "title",
    "columnLabel",
    "columnType",
    "rowLabel",
    "rowSource",
    "columnSource",
    "clickable"
  ],
  data() {
    return {
      graph: undefined
    };
  },
  computed: {
    series() {
      return this.columnIndexes.map((columnIndex, index) => {
        const { name: typeName, ...args } = this.columnType;
        return {
          name:
            this.getLabel(typeName, args, columnIndex, this.$i18n) ??
            columnIndex ??
            "undefined",
          data: this.values.reduce((acc, row) => {
            acc.push(row[index]);
            return acc;
          }, [])
        };
      });
    },
    chartOptions() {
      const columnIndexes = this.columnIndexes;
      const rowIndexes = this.rowIndexes;
      const columnSource = this.columnSource;
      const rowSource = this.rowSource;
      const router = this.$router;
      return {
        chart: {
          type: "bar",
          height: this.mobile ? 200 : 350,
          stacked: true,
          animations: {
            enabled: false
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              if (this.clickable)
                router.push({
                  name: "Search participant",
                  query: {
                    ...(columnIndexes[config.seriesIndex] != "all"
                      ? { [columnSource]: columnIndexes[config.seriesIndex] }
                      : { [columnSource]: undefined }),
                    ...(rowIndexes[config.dataPointIndex] != "all"
                      ? { [rowSource]: rowIndexes[config.dataPointIndex] }
                      : { [rowSource]: undefined })
                  }
                });
            }
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: this.rowIndexes.map(a => (a ? a : "undefined")),
          title: {
            text: this.getLabel("mlstring", {}, this.rowLabel, this.$i18n)
          }
        },
        yaxis: {
          title: {
            text: this.getLabel("mlstring", {}, this.columnLabel, this.$i18n)
          }
        },
        legend: {
          position: this.mobile ? "bottom" : "right",
          offsetX: 0,
          offsetY: this.mobile ? 5 : 50
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
