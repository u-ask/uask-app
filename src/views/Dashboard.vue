<template>
  <div class="px-0">
    <kpi-filters
      v-if="currentUser.samples.length > 1"
      @filterSamples="changeSamples($event)"
    ></kpi-filters>
    <div
      class="d-flex flex-wrap px-0"
      :class="{ 'my-1': mobile, 'mb-1': !mobile }"
      v-for="(kpi, index) in kpis"
      :key="index.value"
    >
      <kpi-figure
        :kpi="kpi"
        :id="kpiId(kpi)"
        :options="kpiOptions(kpi)"
        @selected="onSelect(kpi, $event)"
      ></kpi-figure>
    </div>
    <export-figures :variableNames="selected" :kpiSet="kpiSet"></export-figures>
  </div>
</template>

<script>
import ExportFigures from "../components/figures/ExportFigures.vue";
import KpiFigure from "../components/figures/KpiFigure.vue";
import KpiFilters from "../components/figures/KpiFilters.vue";
import kpi from "../mixin/kpi";

export default {
  data() {
    return {
      selectedSamples: [],
      menuShown: false,
      kpis: undefined,
      kpiSet: undefined,
      selected: []
    };
  },
  methods: {
    async changeSamples(event) {
      this.selectedSamples =
        event.length > 0
          ? this.currentUser.samples.filter(s => event.includes(s.sampleCode))
          : this.currentUser.samples;
      await this.loadKPIs();
    },
    async loadKPIs() {
      const [kpis, kpiSet] = await this.drivers.kpiDriver.getAll(
        this.currentSurvey,
        this.selectedSamples
      );
      this.kpiSet = kpiSet;
      this.kpis = [];
      this.pushKpis(kpis);
    },
    async pushKpis(kpis) {
      if (kpis.length > 0) {
        const [k1, ...k] = kpis;
        this.kpis.push(k1);
        setImmediate(() => {
          this.pushKpis(k);
        });
      }
    },
    onSelect(kpi, select) {
      if (select) this.selected.push(kpi.datasource.column.variableName);
      else this.selected = this.selected.filter(k => k != kpi);
    }
  },
  async mounted() {
    this.selectedSamples = this.currentUser.samples;
    await this.loadKPIs();
  },
  mixins: [kpi],
  components: {
    KpiFigure,
    KpiFilters,
    ExportFigures
  }
};
</script>

<style>
.blured-menu {
  height: 350px;
  width: 350px;
  right: 0px;
  position: sticky;
  background-color: gray;
}
</style>
