<template>
  <v-menu
    ref="menu"
    transition="scale-transition"
    offset-y
    bottom
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="currentDate"
        :disabled="disabled"
        prepend-icon="mdi-calendar"
        @input="update($event)"
        @change="send($event)"
        v-bind="attrs"
        v-on="on"
        :placeholder="datePlaceholder"
      >
        <span slot="append">
          <v-tooltip v-if="!isValid" bottom color="dark">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="danger" v-bind="attrs" v-on="on">
                mdi-alert-circle
              </v-icon>
            </template>
            <span>{{ $t("invalid") }}</span>
          </v-tooltip>
          <slot name="append"></slot>
        </span>
      </v-text-field>
    </template>
    <v-date-picker
      :value="dateValue(value)"
      @change="send($event)"
      no-title
      scrollable
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
import { parse, parseISO, isValid } from "date-fns";
import * as locales from "date-fns/locale";
export default {
  props: ["value", "disabled", "labels"],
  data() {
    return {
      currentDate: undefined
    };
  },
  computed: {
    datePlaceholder() {
      const date = new Date();
      return `Ex: ${date.toISOString().substring(0, 10)} ${this.$t(
        "or"
      )} ${date.toLocaleString().substring(0, 10)}`;
    },
    locale() {
      const locale = new Intl.Locale(
        new Intl.DateTimeFormat().resolvedOptions().locale
      ).language;
      return locales[locale];
    },
    isValid() {
      const formatedDate = this.isoToFormatedDate(this.currentDate);
      return isValid(formatedDate) || this.currentDate == undefined;
    }
  },
  methods: {
    dateValue(value) {
      if (typeof value === "object")
        try {
          const formatedDate = this.getLabel(
            "date",
            [false],
            value,
            this.$i18n
          );
          return formatedDate;
        } catch {
          return;
        }
      return this.dateValue(new Date(value));
    },
    isoToFormatedDate(date) {
      const isISO = /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date);
      const formatedDate = isISO
        ? parseISO(date)
        : parse(date, "P", new Date(), {
            locale: this.locale
          });
      return formatedDate;
    },
    send(date) {
      this.currentDate = date;
      if (this.isValid) {
        this.$emit("change", date ? this.isoToFormatedDate(date) : undefined);
      } else this.currentDate = this.dateValue(this.value);
    },
    update(date) {
      this.currentDate = date;
    }
  },
  mounted() {
    this.currentDate = this.dateValue(this.value);
  },
  watch: {
    value() {
      this.currentDate = this.dateValue(this.value);
    }
  },
  i18n: {
    messages: {
      en: { or: "OR", invalid: "Invalid Date" },
      fr: { or: "OU", invalid: "Date Invalide" }
    }
  }
};
</script>
