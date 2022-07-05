<template>
  <div>
    <v-icon v-if="compact" color="danger" @click="startDelete()">
      mdi-close-box
    </v-icon>
    <v-btn v-else class="text-white" color="danger" @click="startDelete">
      {{ $t("delete", { what: participant ? $t("participant") : "" }) }}
    </v-btn>
    <v-dialog
      v-model="showDialog"
      persistent
      width="500px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card>
        <v-card-title class="bg-danger">
          <v-icon class="mx-3" x-large>mdi-alert-octagon</v-icon>
          {{ $t("justify") }}
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            :items="items"
            v-model="reason"
            :label="$t('reason')"
          ></v-autocomplete>
          <v-textarea
            :label="$t('precise')"
            outlined
            v-model="precision"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="danger"
            outlined
            @click="continueDelete()"
            :disabled="!reason || !precision"
          >
            {{ $t("confirm") }}
          </v-btn>
          <v-btn text color="secondary" @click="abortDelete()">
            {{ $t("action.cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: { interview: Number, participant: Boolean, compact: Boolean },
  data() {
    return {
      showDialog: false,
      precision: "",
      reason: undefined,
      items: [
        this.$t("participantAsked"),
        this.$t("duplicate"),
        this.$t("dataError")
      ]
    };
  },
  methods: {
    startDelete() {
      this.showDialog = true;
      this.reason = "";
      this.precision = "";
    },
    async continueDelete() {
      this.showDialog = false;
      if (this.participant) {
        const justified = this.currentParticipant.update({
          __delete__: { reason: this.reason, precision: this.precision }
        });
        await this.deleteParticipant(justified);
        this.$emit("delete", { participant: justified.participantCode });
      } else {
        const justified = this.currentParticipant.interviews[this.interview].update({
          __delete__: { reason: this.reason, precision: this.precision }
        });
        await this.deleteInterview(justified);
        this.$emit("delete", { interview: this.interview });
      }
      this.reason = "";
      this.precision = "";
    },
    abortDelete() {
      this.showDialog = false;
      this.reason = "";
      this.precision = "";
    }
  },
  i18n: {
    messages: {
      en: {
        delete: "Delete {what}",
        participant: "participant",
        justify: "Justify suppression",
        confirm: "I am sure : delete",
        reason: "Main reason",
        precise: "Precise",
        participantAsked: "Participant asked for withdrawal",
        dataError: "Erroneous data",
        duplicate: "Duplicate"
      },
      fr: {
        delete: "Supprimer {what}",
        participant: "le participant",
        justify: "Justifier la suppression",
        confirm: "Je suis certain : supprimer",
        reason: "Raison principale",
        precise: "Précisez",
        participantAsked: "Demande de retrait du participant",
        dataError: "Données erronées",
        duplicate: "Doublon"
      }
    }
  }
};
</script>
