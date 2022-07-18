<template>
  <v-col cols="12">
    <div class="d-sm-flex align-center">
      <span id="idSample">
        <single-choice-input
          id="sampleCode"
          :placeholder="$t('allSamples')"
          :label="$t('domain.noSample')"
          :type="allSamples"
          v-model="filter['@SAMPLE']"
          :disabled="idSampleDisabled"
          @change="
            onFixedChange({ '@SAMPLE': $event == null ? undefined : $event })
          "
          :compact="true"
        >
          <template v-slot:append>
            <clear-control
              name="SAMPLE"
              @clear="onFixedChange({ '@SAMPLE': undefined })"
            ></clear-control>
          </template>
        </single-choice-input>
      </span>
      <span id="participantIncluded" class="d-flex align-center ml-sm-5">
        <acknowledge-input
          v-model="filter.includedOnly"
          @change="onFixedChange({ includedOnly: $event })"
        ></acknowledge-input>
        {{ $t("participantIncluded") }}
      </span>
    </div>
    <v-card class="mt-3">
      <v-expansion-panels flat focusable>
        <v-expansion-panel>
          <v-expansion-panel-header id="toogleFilter">
            <template v-slot:default="{ open }">
              <strong>{{
                open ? $t("hideFilters") : $t("showFilters")
              }}</strong>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <text-input
              id="participantCode"
              v-model="filter.idParticipant"
              :disabled="false"
              :label="$t('domain.noParticipant')"
              @input="onFixedChange({ idParticipant: $event })"
            >
              <template v-slot:append>
                <clear-control
                  name="PCODE"
                  @clear="onFixedChange({ idParticipant: undefined })"
                ></clear-control>
              </template>
            </text-input>
            <span id="interviewStatus">
              <multiple-choice-input
                :label="$t('interviewStatusLb')"
                :type="options"
                v-model="filter.interviewStatus"
                @change="
                  onFixedChange({
                    interviewStatus: $event == undefined ? [] : $event
                  })
                "
                :chips="true"
                :compact="true"
              >
                <template v-slot:append>
                  <clear-control
                    name="ISTATUS"
                    @clear="onFixedChange({ interviewStatus: [] })"
                  ></clear-control>
                </template>
              </multiple-choice-input>
            </span>
            <customized-filter
              @input="onCustomChange($event)"
            ></customized-filter>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-col>
</template>

<style scoped>
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>

<script>
import { mapGetters, mapMutations } from "vuex";
import CustomizedFilter from "./CustomizedFilter";
import TextInput from "../input/TextInput.vue";
import AcknowledgeInput from "../input/AcknowledgeInput.vue";
import SingleChoiceInput from "../input/SingleChoiceInput.vue";
import MultipleChoiceInput from "../input/MultipleChoiceInput.vue";
import ClearControl from "../input/ClearControl.vue";

export default {
  data() {
    return {
      filter: {
        idParticipant: undefined,
        "@SAMPLE": undefined,
        interviewStatus: [],
        includedOnly: true
      },
      customFilters: [],
      allSamples: []
    };
  },
  computed: {
    ...mapGetters("filters", ["currentParticipantFilters"]),
    options() {
      return [
        { value: "fulfilled", text: this.$t("completeInterviews") },
        { value: "incomplete", text: this.$t("incompleteInterviews") },
        { value: "insufficient", text: this.$t("insufficientInterviews") }
      ];
    },
    idSampleDisabled() {
      return this.currentUser.sampleCodes.length == 1;
    },
    customFiltersFromQuery() {
      return {
        ...this.currentSurvey.pins
          .filter(p => Object.keys(this.$route.query).includes(p.variableName))
          .reduce((a, p) => {
            const { name: typeName, ...args } = p.type;
            return {
              ...a,
              [p.variableName]: {
                pin: p,
                value: this.itemToValue(
                  typeName,
                  this.$route.query[p.variableName],
                  args
                )
              }
            };
          }, {})
      };
    }
  },
  methods: {
    ...mapMutations("filters", ["setParticipantFilters"]),
    onCustomChange(change) {
      this.customFilters = this.customFilters.filter(f => f.pin != change.pin);
      if (typeof change.value != "undefined") {
        this.customFilters.push(change);
        this.setParticipantFilters({ [change.pin.variableName]: change });
      } else {
        this.setParticipantFilters({ [change.pin.variableName]: undefined });
      }
      this.updateFilter({ [change.pin.variableName]: change.value });
    },
    updateQuery: function(change) {
      change = Object.entries(change).reduce((res, [key, value]) => {
        if (typeof value == "object") value = JSON.stringify(value);
        return { ...res, [key]: value };
      }, {});
      const routeQ = { ...this.$route.query, ...change };
      this.$router.replace({
        query: JSON.parse(JSON.stringify(routeQ))
      });
    },
    sendFilter: function() {
      const filter = { fixed: this.filter, custom: this.customFilters };
      this.$emit("filterchanged", filter);
    },
    onFixedChange(change) {
      this.setParticipantFilters(change);
      this.filter = { ...this.filter, ...change };
      this.updateFilter(change);
    },
    updateFilter(change) {
      this.updateQuery(change);
      this.sendFilter();
    },
    retrieveCurrentFilters() {
      const filters = {};
      this.customFilters = [];
      Object.keys(this.currentParticipantFilters).map(k => {
        if (Object.keys(this.filter).includes(k)) {
          this.filter[k] = this.currentParticipantFilters[k];
          filters[k] = this.currentParticipantFilters[k];
        } else {
          const value =
            typeof this.currentParticipantFilters[k].value == "string" &&
            this.currentParticipantFilters[k].value.includes("{")
              ? JSON.parse(this.currentParticipantFilters[k].value)
              : this.currentParticipantFilters[k].value;
          this.customFilters.push({
            pin: this.currentParticipantFilters[k].pin,
            value
          });
          filters[k] = value;
        }
        this.updateQuery(filters);
      });
    }
  },
  async mounted() {
    this.allSamples = this.currentUser.sampleCodes.map(s => {
      return { value: s, text: s };
    });
    this.filter["@SAMPLE"] =
      this.currentUser.sampleCodes.length == 1
        ? this.currentUser.sampleCodes[0]
        : undefined;
    const filters = {
      ...this.currentParticipantFilters,
      ...this.filters,
      ...this.$route.query,
      ...this.customFiltersFromQuery
    };
    if (filters.interviewStatus && typeof filters.interviewStatus == "string")
      filters.interviewStatus = [filters.interviewStatus];
    this.setParticipantFilters(filters);
    this.retrieveCurrentFilters();
    this.sendFilter();
  },
  i18n: {
    messages: {
      en: {
        filters: "Advanced Filters",
        showFilters: "Show filters",
        hideFilters: "Hide filters",
        interviewStatusLb: "Interview status",
        completeInterviews: "Completed",
        incompleteInterviews: "Incomplete",
        insufficientInterviews: "Insufficient",
        participantIncluded: "Only included Participants",
        allSamples: "All samples"
      },
      fr: {
        filters: "Filtres Avancés",
        showFilters: "Afficher les filtres",
        hideFilters: "Cacher les filtres",
        interviewStatusLb: "Statut de la interview",
        completeInterviews: "Complètes",
        incompleteInterviews: "Incomplètes",
        insufficientInterviews: "Insuffisantes",
        participantIncluded: "Participants inclus uniquement",
        allSamples: "Tous les échantillons"
      }
    }
  },
  components: {
    CustomizedFilter,
    TextInput,
    AcknowledgeInput,
    SingleChoiceInput,
    MultipleChoiceInput,
    ClearControl
  }
};
</script>

<style>
strong {
  font-size: 1rem;
}
</style>
