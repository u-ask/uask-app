<template>
  <apexchart
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
      graph: undefined
    };
  },
  computed: {
    series() {
      const bars = this.columnIndexes.map((columnIndex, index) => {
        return {
          type: "bar",
          name: columnIndex,
          data: this.values?.reduce((acc, row) => {
            acc.push(row[index]);
            return acc;
          }, [])
        };
      });
      return bars;
    },
    chartOptions() {
      return {
        chart: {
          type: "bar",
          height: this.mobile ? 200 : 350,
          stacked: true,
          animations: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: this.mobile ? false : true
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: this.mobile ? false : true,
              position: "top",
              maxItems: 100,
              hideOverflowingLabels: true,
              orientation: "horizontal"
            }
          }
        },
        xaxis: {
          categories: this.rowIndexes,
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
