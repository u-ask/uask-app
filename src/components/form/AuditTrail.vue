<template>
  <v-card class="my-3">
    <v-card-title>Audit-trail</v-card-title>
    <v-data-table id="audit-table" :headers="headers" :items="rows">
      <template v-slot:[`item.value`]="{ item }">
        <div v-if="typeof item.value != 'undefined'">
          {{ item.value }}
        </div>
        <div v-else class="font-italic">&lt;{{ $t("empty") }}&gt;</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { AuditTrail } from "uask-sys";

export default {
  props: ["pageItem", "recordset"],
  data() {
    return {
      records: []
    };
  },
  computed: {
    checked() {
      return this.currentInterview.checked(this.pageItem);
    },
    rows() {
      return this.records.map(r => ({
        on: this.getLabel("datetime", {}, r.date, this.$i18n),
        event: this.getLabel("mlstring", {}, r.operation, this.$i18n),
        value: r.current,
        by: `${r.user.title ?? ""} ${r.user.name ?? r.user ?? ""} ${r.user
          .firstName ?? ""}`
      }));
    },
    headers() {
      return [
        { text: this.$t("on"), value: "on", width: "13rem" },
        { text: this.$t("by"), value: "by" },
        { text: this.$t("event"), value: "event" },
        { text: this.$t("value"), value: "value" }
      ];
    }
  },
  methods: {
    async setRecords() {
      const r = await this.drivers.auditDriver.get(this.currentSurvey, {
        participantCode: this.currentParticipant.participantCode,
        nonce: this.currentInterview.nonce,
        variableName: this.pageItem.variableName,
        ...(this.recordset ? { instance: this.pageItem.instance } : {})
      });
      const signatureRecords = await this.drivers.auditDriver.get(
        this.currentSurvey,
        {
          participantCode: this.currentParticipant.participantCode,
          nonce: this.currentInterview.nonce
        },
        [
          { en: "signed", fr: "signature" },
          { en: "signature canceled", fr: "signature annulée" }
        ]
      );
      this.records = new AuditTrail(r.concat(signatureRecords), this.pageItem);
    }
  },
  mounted() {
    this.setRecords();
  },
  watch: {
    currentInterview() {
      this.setRecords();
    }
  },
  i18n: {
    messages: {
      en: {
        on: "Date",
        event: "Event",
        value: "Value",
        by: "Done by",
        update: "update",
        create: "creation",
        empty: "empty"
      },
      fr: {
        on: "Date",
        event: "Opération",
        value: "Valeur",
        by: "Réalisé par",
        update: "mise à jour",
        create: "création",
        empty: "vide"
      }
    }
  }
};
</script>
