<template>
  <print-button
    :id="`print-${participant}`"
    :css="css"
    :get="get"
    :title="title"
    :compact="compact"
  ></print-button>
</template>

<script>
import PrintButton from "./PrintButton.vue";

export default {
  components: { PrintButton },
  props: ["participant", "compact"],
  computed: {
    css() {
      return "/print/data.css";
    },
    participantCode() {
      return this.participant.participantCode ?? this.participant ?? "blank";
    },
    lang() {
      return this.currentSurvey.options.languages.includes(this.$i18n.locale)
        ? this.$i18n.locale
        : this.currentSurvey.options.defaultLang;
    },
    get() {
      return `print/${this.currentSurvey.name}/${this.participantCode}/${this.lang}`;
    },
    title() {
      if (
        this.participantCode == "blank" ||
        this.participantCode == "annotated"
      )
        return this.$t(this.participantCode);
      return this.$t("form");
    }
  },
  i18n: {
    messages: {
      en: {
        form: "form",
        blank: "blank Data",
        annotate: "annotated Data"
      },
      fr: {
        form: "formulaire",
        blank: "Data vierge",
        annotated: "Data annoté"
      }
    }
  }
};
</script>
