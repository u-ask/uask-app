<template>
  <span>
    <em
      ><u>{{ $t("lastEdit") }}</u></em
    >
    <strong
      ><u>{{ lastUpdate }}</u></strong
    >
  </span>
</template>

<script>
export default {
  computed: {
    lastUpdate() {
      return this.getLabel(
        "datetime",
        {},
        this.currentInterview?.lastInput,
        this.$i18n
      );
    }
  },
  i18n: {
    messages: {
      en: {
        lastEdit: "Last modified : "
      },
      fr: {
        lastEdit: "Dernière modification : "
      }
    }
  }
};
</script>
