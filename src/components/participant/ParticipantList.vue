<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>Participants</v-card-title>
      <v-data-table
        id="ParticipantListTable"
        :items="tabItems"
        :headers="headers"
        :loading="loading"
        :loading-text="$t('events.loading')"
        flat
      >
        <template v-slot:[`item.lastInterviewInfo`]="{ item }">
          <page-set-label
            :interview="{
              date: item.lastInterviewInfo.date,
              status: item.lastInterviewInfo.status,
              pageSet: { type: item.lastInterviewInfo.type }
            }"
          ></page-set-label>
          <fill-rate
            v-if="
              currentSurvey.options.showFillRate && item.lastInterviewInfo.date
            "
            class="lastInterviewfillRate"
            :max="1"
            :value="item.lastInterviewInfo.fillRate"
          ></fill-rate>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex">
            <v-chip
              class="mr-2 openData"
              color="primary"
              @click="openData(item.participant)"
              >{{ $t("action.openData") }}</v-chip
            >
            <v-chip
              class="mr-2 openHome"
              color="success"
              @click="openHome(item.participant)"
              >{{
                getLabel(
                  "mlstring",
                  {},
                  currentSurvey.workflows[0].info.type,
                  $i18n
                )
              }}</v-chip
            >
            <print-Data
              :participant="item.participant"
              :compact="true"
            ></print-Data>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
import FillRate from "../form/FillRate";
import PageSetLabel from "../form/PageSetLabel.vue";
import PrintData from "../tools/PrintData.vue";
import participantFilters from "../../mixin/participantFilters";
import { formatCode } from "uask-dom";

export default {
  props: ["filter"],
  data() {
    return {
      allParticipants: [],
      perPage: 5,
      fixedHeaders: [
        {
          text: this.$t("domain.noSample"),
          value: "sample",
          class: "tableContentSampleCode"
        },
        {
          text: this.$t("domain.noParticipant"),
          value: "participantCode",
          class: "tableContentParticipantId"
        },
        {
          text: this.$t("lastPageSet"),
          value: "lastInterviewInfo",
          class: "tableContentLastInterviewInfo"
        }
      ],
      loading: false
    };
  },
  computed: {
    headers: function() {
      let fixedHeaders = this.fixedHeaders;
      if (this.currentUser.sampleCodes.length == 1) {
        fixedHeaders = this.fixedHeaders.slice(1);
      }
      return fixedHeaders.concat(this.pinsHeaders, this.actionHeaders);
    },
    pinsHeaders: function() {
      return this.currentSurvey.pins.map(pin => {
        return {
          text: this.getLabel("mlstring", {}, pin.pin, this.$i18n),
          value: this.getLabel("mlstring", {}, pin.pin, this.$i18n)
        };
      });
    },
    actionHeaders: function() {
      return { text: "Actions", value: "action" };
    },
    tabItems: function() {
      return this.filteredParticipants.map(p => {
        const currentInterview = p.currentInterview;
        return {
          sample: p.sampleCode,
          participantCode: formatCode(p, this.currentSurvey.options),
          participant: p,
          lastInterviewInfo: {
            date: currentInterview?.date,
            type: currentInterview?.type ?? {},
            status: currentInterview?.status ?? "incomplete",
            fillRate: currentInterview?.fillRate ?? 0
          },
          ...Object.fromEntries(
            this.currentSurvey.pins.map(pin => {
              const header = this.getLabel("mlstring", {}, pin.pin, this.$i18n);
              if (pin.variableName in p.pins) {
                const item = p.pins[pin.variableName];
                const { name: typeName, ...args } = item.type;
                return [
                  header,
                  this.getLabel(typeName, args, item.value, this.$i18n)
                ];
              }
              return [header, undefined];
            })
          )
        };
      });
    },
    filteredParticipants: function() {
      const customFilter = this.filter.custom?.map(f => {
        return { [f.pin.variableName]: f.value };
      });
      const query = Object.assign(
        {},
        this.filter.fixed,
        ...(customFilter ?? [])
      );
      const apply = this.participantFilters.apply(query);
      return this.allParticipants.filter(p => apply(p));
    }
  },
  methods: {
    async openData(p) {
      const samples = await this.drivers.sampleDriver.getAll(
        this.currentSurvey
      );
      const participant = await this.drivers.participantDriver.getByParticipantCode(
        this.currentSurvey,
        samples,
        p.participantCode
      );
      this.setParticipant(participant);
      this.setInterview(participant.currentInterview(this.currentWorkflow));
      this.$router.push({
        name: "Participant Data",
        params: { participantCode: participant.participantCode }
      });
    },
    async openHome(p) {
      const samples = await this.drivers.sampleDriver.getAll(
        this.currentSurvey
      );
      const participant = await this.drivers.participantDriver.getByParticipantCode(
        this.currentSurvey,
        samples,
        p.participantCode
      );
      this.setParticipant(participant);
      this.setInterview(participant.interviews[0]);
      this.$router.push({
        name: "Participant Data",
        params: { participantCode: participant.participantCode }
      });
    }
  },
  mixins: [participantFilters],
  async mounted() {
    this.loading = true;
    const userSampleCodes = this.currentUser.sampleCodes;
    this.allParticipants = await this.drivers.summaryDriver
      .getAll(this.currentSurvey, undefined, [
        "participantCode",
        "sampleCode",
        "currentInterview",
        "interviewCount",
        "pins",
        "included"
      ])
      .then(res => res.filter(p => userSampleCodes.includes(p.sampleCode)));
    this.setParticipant(undefined);
    this.loading = false;
  },
  components: {
    FillRate,
    PageSetLabel,
    PrintData
  },
  i18n: {
    messages: {
      en: { pageSet: "@:domain.pageSet", lastPageSet: "Last @.lower:pageSet" },
      fr: {
        pageSet: "@:domain.pageSet",
        lastPageSet: "Dernière @.lower:pageSet"
      }
    }
  }
};
</script>
<style>
.table th,
.table td {
  vertical-align: middle;
}
</style>
