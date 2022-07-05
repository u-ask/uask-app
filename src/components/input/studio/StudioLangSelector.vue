<template>
  <v-combobox
    multiple
    chips
    deletable-chips
    color="info"
    :items="commonLangs"
    :value="value"
    clearable
    :search-input.sync="search"
    @input="$emit('input', $event)"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t("noResult") }} "<strong>{{ search }}</strong
            >". {{ $t("press") }} <kbd>enter</kbd> {{ $t("createNew") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
export default {
  props: ["value", "classes"],
  data() {
    return {
      commonLangs: ["en", "fr"],
      search: null
    };
  },
  i18n: {
    messages: {
      en: {
        noResult: "No result for ",
        press: "Press ",
        createNew: " to create a new one"
      },
      fr: {
        noResult: "Pas de résultat pour ",
        press: "Appuyez sur ",
        createNew: " pour créer une nouvelle entrée"
      }
    }
  }
};
</script>
