<template>
  <div id="alert-table">
    <v-text-field
      outlined
      v-model="search"
      :label="$t('search')"
      id="search-alert"
      clearable
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      :loading-text="$t('events.loading')"
      :search="search"
    >
      <template v-slot:[`item.Message`]="{ item }">
        <v-chip color="danger" :to="link(item)" href="#" outlined>
          {{ item.Message }}
        </v-chip>
      </template>
      <template v-slot:[`item.Type`]="{ item }">
        {{ itemType(item) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { formatCode } from "uask-dom";

export default {
  data() {
    return {
      allAlerts: [],
      loading: false,
      search: undefined
    };
  },
  computed: {
    rows() {
      return this.allAlerts.map(a => ({
        [this.$t("sample")]: a.sampleCode,
        [this.$t("participant")]: formatCode(
          { participantCode: a.participantCode },
          this.currentSurvey.options
        ),
        [this.$t("interview")]: this.getLabel(
          "mlstring",
          {},
          a.interview.type,
          this.$i18n
        ),
        [this.$t("date")]: this.getLabel(
          "date",
          {},
          a.interview.date,
          this.$i18n
        ),
        [this.$t("page")]: this.getLabel(
          "mlstring",
          {},
          a.page.name,
          this.$i18n
        ),
        [this.$t("wording")]: this.getLabel(
          "mlstring",
          {},
          a.item?.wording,
          this.$i18n
        ),
        [this.$t("message")]: a.message,
        tags: a.tags
      }));
    },
    headers() {
      return [
        { text: this.$t("sample"), value: this.$t("sample") },
        { text: this.$t("participant"), value: this.$t("participant") },
        { text: this.$t("interview"), value: this.$t("interview") },
        { text: this.$t("date"), value: this.$t("date") },
        { text: this.$t("page"), value: this.$t("page") },
        { text: this.$t("wording"), value: this.$t("wording") },
        { text: this.$t("message"), value: this.$t("message") },
        { text: this.$t("type"), value: this.$t("type") }
      ];
    }
  },
  methods: {
    link(item) {
      const index = this.rows.indexOf(item);
      const alert = this.allAlerts[index];
      const route = {
        name: "Participant Data",
        params: { participantCode: alert.participantCode },
        query: {
          interview: alert.interview.index,
          page: alert.page.index
        },
        hash: alert.item ? `#${alert.item.variableName}` : ""
      };
      return route;
    },
    itemType(item) {
      return this.$t(item.Type);
    }
  },
  async mounted() {
    this.loading = true;
    const sample =
      this.currentUser.samples.length == 1
        ? this.currentUser.samples[0]
        : undefined;
    const userSampleCodes = this.currentUser.samples.map(s => s.sampleCode);
    const participants = await this.drivers.summaryDriver
      .getParticipantSummaries(this.currentSurvey, sample, [
        "participantCode",
        "sampleCode",
        "alerts"
      ])
      .then(res => res.filter(p => userSampleCodes.includes(p.sampleCode)));
    this.allAlerts = participants.reduce(
      (r, p) => [
        ...r,
        ...p.alerts.map(a => ({
          ...a,
          type: a.type,
          sampleCode: p.sampleCode,
          participantCode: p.participantCode
        }))
      ],
      []
    );
    this.loading = false;
  },
  i18n: {
    messages: {
      en: {
        message: "Message",
        wording: "Wording",
        sample: "Sample",
        participant: "Participant",
        interview: "Interview",
        page: "Page",
        date: "Date",
        type: "Type",
        rule: "Rule",
        search: "Search"
      },
      fr: {
        message: "Message",
        wording: "Intitulé",
        variable: "Variable",
        sample: "Échantillon",
        participant: "Participant",
        interview: "Interview",
        page: "Page",
        date: "Date",
        type: "Type",
        rule: "Règle",
        search: "Recherche"
      }
    }
  }
};
</script>
