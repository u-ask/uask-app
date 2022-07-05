<template>
  <apexchart
    :height="mobile ? '200' : '350'"
    type="line"
    :options="chartOptions"
    :series="series"
    @click="display($event, context)"
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
      graph: undefined
    };
  },
  computed: {
    series() {
      const bars = this.columnIndexes.map((columnIndex, index) => {
        return {
          type: "line",
          name: columnIndex,
          data: this.values?.reduce((acc, row, i) => {
            acc.push(i == 0 ? row[index] : acc[i - 1] + row[index]);
            return acc;
          }, [])
        };
      });
      return bars;
    },
    chartOptions() {
      return {
        chart: {
          type: "line",
          height: this.mobile ? 200 : 350,
          animations: {
            enabled: false
          }
        },
        stroke: {
          curve: "stepline"
        },
        labels: this.rowIndexes,
        xaxis: {
          type: "datetime",
          title: {
            text: this.getLabel("mlstring", {}, this.rowLabel, this.$i18n)
          },
          labels: {
            datetimeFormatter: {
              year: "yyyy",
              month: "MMM 'yy",
              day: "dd MMM 'yy",
              hour: "HH:mm"
            }
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
    this.$emit("clickable", false);
  }
};
</script>
