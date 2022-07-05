<template>
  <div
    :class="{
      'col-12 px-0': show,
      'my-0': show && !mobile,
      'my-1': !show,
      'p-0': mobile
    }"
    elevation="1"
  >
    <v-card v-if="!show" :class="{ 'ml-4': !mobile, 'py-0': mobile }">
      <v-card-text class="p-2" @click="show = true">
        <v-icon left @click="show = true" color="info">
          mdi-eye
        </v-icon>
        <span>{{ title }}</span>
      </v-card-text>
    </v-card>
    <div v-else :class="{ 'border border-primary rounded bg-white': selected }">
      <v-checkbox
        v-if="selectable"
        :hide-details="true"
        class="mb-1 mt-0 mx-1"
        @change="onCheck($event)"
      ></v-checkbox>
      <v-card :elevation="selected ? 0 : 1">
        <v-card-title :class="{ 'px-0 pt-0': mobile }">
          <div class="align-center col" :class="{ 'd-flex': !mobile }">
            <div
              class="d-flex align-center col px-0"
              :class="{ 'pt-0': mobile }"
            >
              <v-btn
                filter
                color="info"
                :icon="mobile"
                :outlined="!mobile"
                @click="show = false"
                class="mx-0"
              >
                <v-icon :left="!mobile">
                  mdi-eye-off
                </v-icon>
                <span v-if="!mobile">{{ $t("hide") }}</span>
              </v-btn>
              <v-divider vertical class="mx-3" v-if="!mobile"></v-divider>
              <span>{{ title }}</span>
            </div>
            <v-spacer v-if="!mobile"></v-spacer>
            <kpi-parameters
              v-show="show"
              :display="display"
              :options="options"
              :clickable="clickable"
              @graph="display = $event"
            ></kpi-parameters>
          </div>
        </v-card-title>
        <v-card-text v-show="show" :class="{ 'pb-0': mobile }">
          <component
            :is="display"
            v-if="kpi"
            :kpi="kpi"
            :values="values"
            :title="kpi.title"
            :rowLabel="kpi.datasource.row.label"
            :columnLabel="kpi.datasource.column.label"
            :columnIndexes="columnIndexes"
            :rowIndexes="rowIndexes"
            :rowSums="kpi.rowSums"
            :columnSource="kpi.datasource.column.variableName"
            :columnType="kpi.datasource.column.type"
            :rowSource="kpi.datasource.row.variableName"
            :kpiName="options.name"
            @clickable="onClickable($event)"
            :clickable="clickable"
          ></component>
        </v-card-text>
        <v-card-actions
          v-if="show"
          v-show="options.aggregates.length > 0"
          class="d-flex justify-center"
        >
          <v-chip-group v-model="aggIndex">
            <v-chip
              v-for="agg in options.aggregates"
              :key="agg"
              filter
              outlined
              :color="aggIndex == agg ? 'success' : ''"
              :small="mobile"
            >
              {{ parametersLabels(agg) }}
            </v-chip>
          </v-chip-group>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import Histogram from "./Histogram.vue";
import Matrix from "./Matrix.vue";
import Pies from "./Pies.vue";
import BoxPlot from "./BoxPlot.vue";
import HistogramTimeSeries from "./HistogramTimeSeries.vue";
import LineTimeSeries from "./LineTimeSeries.vue";
import KpiParameters from "./KpiParameters.vue";
import AcknowledgeInput from "../input/AcknowledgeInput.vue";

export default {
  props: ["kpi", "options"],
  data() {
    return {
      display: undefined,
      aggIndex: undefined,
      show: true,
      clickable: false,
      selected: false
    };
  },
  components: {
    Matrix,
    KpiParameters,
    Histogram,
    Pies,
    BoxPlot,
    HistogramTimeSeries,
    LineTimeSeries,
    AcknowledgeInput
  },
  computed: {
    selectable() {
      return this.options.selectable;
    },
    variableName() {
      return this.kpi.datasource.column.variableName;
    },
    title() {
      return this.getLabel(
        "mlstring",
        {},
        this.kpi ? this.kpi.title : undefined,
        this.$i18n
      );
    },
    values() {
      return Reflect.get(this.kpi, this.aggregate);
    },
    aggregate() {
      return this.options.aggregates[this.aggIndex];
    },
    rowIndexes() {
      return this.aggregate == "columnSums"
        ? ["all"]
        : this.kpi.datasource.row.values;
    },
    columnIndexes() {
      return this.aggregate == "rowSums"
        ? ["all"]
        : this.kpi.datasource.column.values;
    }
  },
  methods: {
    onCheck(val) {
      this.selected = val;
      this.$emit("selected", val);
    },
    onClickable(v) {
      if (v && this.variableName)
        this.clickable = this.currentSurvey.items.some(
          i => i.variableName == this.variableName && !!i.pin
        );
      else this.clickable = v;
    },
    parametersLabels(param) {
      switch (param) {
        case "values":
          return `${this.$t("break")} ${this.getLabel(
            "mlstring",
            {},
            this.kpi?.datasource.row.label,
            this.$i18n
          )}`.toUpperCase();
        case "columnSums":
          return `${this.$t("aggregate")} ${this.getLabel(
            "mlstring",
            {},
            this.kpi?.datasource.row.label,
            this.$i18n
          )}`.toUpperCase();
        case "rowSums":
          return `${this.$t("aggregate")} ${this.getLabel(
            "mlstring",
            {},
            this.kpi?.datasource.column.label,
            this.$i18n
          )}`.toUpperCase();
      }
    }
  },
  mounted() {
    this.display = this.options.default;
    this.aggIndex = 0;
  },
  i18n: {
    messages: {
      en: {
        break: `By `,
        aggregate: `Aggregate `,
        hide: "Hide"
      },
      fr: {
        break: `Par `,
        aggregate: "Aggréger ",
        hide: "Cacher"
      }
    }
  }
};
</script>

<style>
.apexcharts-series path {
  cursor: pointer;
}
.select {
  height: 2em;
}
</style>
