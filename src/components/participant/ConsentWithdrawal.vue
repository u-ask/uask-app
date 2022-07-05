<template>
  <div v-if="consent">
    <v-btn
      block
      outlined
      id="withdraw"
      href=""
      @click.prevent="withdraw"
      text
      color="danger"
    >
      {{ $t(compact ? "compact-text" : "text") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    compact: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    consent() {
      return this.currentParticipant.consent;
    }
  },
  methods: {
    withdraw() {
      const consent = this.currentParticipant.interviews.find(i => i.consent);
      this.createInterview(consent.pageSet);
    }
  },
  i18n: {
    messages: {
      en: {
        text: "Consent withdrawal",
        "compact-text": "Withdrawal"
      },
      fr: {
        text: "Retrait du consentement",
        "compact-text": "Retrait"
      }
    }
  }
};
</script>
