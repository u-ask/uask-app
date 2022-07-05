import {
  InclusionsBySamples,
  NumericalDistribution,
  CategoricalDistribution
} from "uask-dom";

export class KPIOptions {
  constructor(survey) {
    this.queriesBySamples = {
      name: "QueriesBySamples",
      types: ["matrix", "pies", "histogram"],
      default: "histogram",
      aggregates: ["values", "columnSums"],
      selectable: false
    };
    this.categoricalDisribution = {
      name: "CategoricalDistribution",
      types: ["matrix", "histogram", "pies"],
      default: "histogram",
      aggregates: ["values", "columnSums"],
      selectable: true,
      items: survey.kpis
        .filter(pi => pi.type.nature == "categorical")
        .map(p => ({ name: p.kpi, value: p.variableName }))
    };
    this.numericalDistribution = {
      name: "NumericalDistribution",
      types: ["matrix", "boxPlot"],
      default: "boxPlot",
      aggregates: ["values", "columnSums"],
      selectable: true,
      items: survey.kpis
        .filter(pi => pi.type.nature == "numerical")
        .map(p => ({ name: p.kpi, value: p.variableName }))
    };
    this.inclusionsBySamples = {
      name: "InclusionBySample",
      types: ["matrix", "histogramTimeSeries", "lineTimeSeries"],
      default: "lineTimeSeries",
      aggregates: ["values", "rowSums"],
      selectable: false
    };
  }
}

export default {
  computed: {
    allOptions() {
      return new KPIOptions(this.currentSurvey);
    }
  },
  methods: {
    kpiOptions(kpi) {
      if (kpi instanceof InclusionsBySamples)
        return this.allOptions.inclusionsBySamples;
      if (kpi instanceof NumericalDistribution)
        return this.allOptions.numericalDistribution;
      if (kpi instanceof CategoricalDistribution)
        return this.allOptions.categoricalDisribution;
    },
    kpiId(kpi) {
      if (kpi instanceof InclusionsBySamples) return "InclusionsBySamples";
      if (kpi instanceof NumericalDistribution)
        return `NumericalDistribution_${kpi.datasource.column.variableName}`;
      if (kpi instanceof CategoricalDistribution)
        return `CategoricalDistribution_${kpi.datasource.column.variableName}`;
    }
  }
};
