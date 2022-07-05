<template>
  <div class="special-values align-self-center" :data-specialValue="value">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="current.value == 'empty'"
          v-bind="attrs"
          v-on="on"
          outlined
          icon
          class="btn-empty empty-text"
        >
          <v-avatar><v-icon>mdi-dots-vertical</v-icon></v-avatar>
        </v-btn>
        <v-btn
          v-else
          light
          v-bind="attrs"
          v-on="on"
          :block="$vuetify.breakpoint.mobile"
          text
          outlined
          :class="`btn-${current.value}`"
          :color="current.color"
        >
          <div class="d-inline-block empty-text">
            {{ current.display }}
          </div>
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </template>
      <v-item-group id="specialValues">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :class="`item-${item.value}`"
          :color="item.color"
          class="bg-white"
          focusable
          @click="changeValue(item.value)"
          >{{ item.display }}
        </v-list-item>
      </v-item-group>
    </v-menu>
  </div>
</template>

<style>
.special-values {
  padding-left: 1em;
  height: 2rem;
}
.special-values .dropdown-toggle,
.special-values .dropdown-toggle em {
  margin: 0;
  /* margin-top: -0.25rem; */
}
.special-values .btn-empty {
  text-transform: capitalize !important;
  opacity: 0.7;
  font-style: italic;
}

.special-values .btn-empty .empty-text {
  line-height: 80%;
  white-space: normal;
  text-align: left;
}

.special-values .dropdown-menu {
  min-width: fit-content;
}
</style>
<script>
export default {
  props: ["value", "special-values", "compact"],
  computed: {
    current() {
      const item = this.items.find(item => item.value == this.value);
      return (
        item ?? {
          value: "empty",
          display: this.compact
            ? this.$t("compactSpecialValue")
            : this.$t("specialValue"),
          variant: "light"
        }
      );
    },
    items() {
      return [
        {
          value: "notDefined",
          color: "primary",
          display: "ND"
        },
        {
          value: "notApplicable",
          color: "warning",
          display: "NA"
        },
        {
          value: "unknown",
          color: "success",
          display: "UK"
        }
      ].filter(e => this.specialValues.find(v => e.value == v));
    }
  },
  methods: {
    changeValue(val) {
      const value = this.value == val ? undefined : val;
      if (this.value != value) {
        this.$emit("change", value);
      }
    }
  },
  i18n: {
    messages: {
      en: { specialValue: "Special value", compactSpecialValue: "SV" },
      fr: { specialValue: "Valeur particulière", compactSpecialValue: "VP" }
    }
  }
};
</script>
