<template>
  <v-expansion-panels flat focusable>
    <v-expansion-panel>
      <v-expansion-panel-header id="toggle-filter">
        <strong>{{ $t("filters") }}</strong>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div id="tag-options" class="mt-4">
          <v-combobox
            label="Tags:"
            :items="options.tags"
            :value="selected.tags"
            @input="tagsChanged"
            @click:clear="tagsChanged([])"
            multiple
            chips
            clearable
          >
            <template v-slot:selection="data">
              <v-chip
                class="mt-2"
                :key="JSON.stringify(data.item)"
                outlined
                color="primary"
                >{{ data.item }}</v-chip
              >
            </template>
          </v-combobox>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: ["options"],
  data: function() {
    return { selected: { tags: [] } };
  },
  methods: {
    tagsChanged(tags) {
      this.selected.tags = tags ?? [];
      this.send();
    },
    send() {
      this.$emit("input", this.selected);
    }
  },
  i18n: {
    messages: {
      en: {
        filters: "Filters",
        showFilters: "Show filters",
        hideFilters: "Hide filters"
      },
      fr: {
        filters: "Filtres",
        showFilters: "Afficher les filtres",
        hideFilters: "Cacher les filtres"
      }
    }
  }
};
</script>
