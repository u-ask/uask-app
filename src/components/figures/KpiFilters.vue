<template>
  <v-combobox
    outlined
    :label="$t('sample')"
    :placeholder="$t('allSamples')"
    multiple
    clearable
    :items="samples"
    @input="
      $emit(
        'filterSamples',
        $event.map(s => s.value)
      )
    "
    id="samplesFilter"
    hide-details
  ></v-combobox>
</template>

<script>
export default {
  computed: {
    samples() {
      return this.currentUser.sampleCodes.map(s => ({
        text: `${s} - ${s.name}`,
        value: s
      }));
    }
  },
  i18n: {
    messages: {
      en: {
        sample: "Filter on Samples",
        allSamples: "All Samples"
      },
      fr: {
        sample: "Filtrer sur les Échantillons",
        allSamples: "Tous les samples"
      }
    }
  }
};
</script>
