<template>
  <v-menu
    ref="menu"
    v-model="menu2"
    :close-on-content-click="false"
    :nudge-right="180"
    :disabled="disabled"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="time"
        @change="changeTime($event)"
        @blur="onBlur()"
        :label="$t('label')"
        prepend-icon="mdi-clock-outline"
        v-bind="attrs"
        v-on="on"
      >
        <span slot="append">
          <v-tooltip
            v-if="!isValid && time != undefined && time != ''"
            bottom
            color="dark"
          >
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
    <v-time-picker
      v-if="menu2"
      v-model="time"
      format="24hr"
      full-width
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["value", "disabled"],
  data() {
    return {
      time: null,
      menu2: false
    };
  },
  computed: {
    dateValue() {
      const [hours, minutes] = this.time
        ? this.time?.split(":")
        : [undefined, undefined];
      return new Date(0, 0, 0, hours, minutes, 0);
    },
    isValid() {
      const min = new Date(0, 0, 0, 0, 0, 0);
      const max = new Date(0, 0, 0, 23, 59, 0);
      return (
        this.dateValue.toString() != "Invalid Date" &&
        this.dateValue >= min &&
        this.dateValue <= max
      );
    }
  },
  methods: {
    changeTime(time) {
      this.time = time;
    },
    onBlur() {
      if (this.isValid) this.$emit("change", this.dateValue);
    }
  },
  mounted() {
    this.time = this.getLabel(
      "time",
      { duration: false },
      this.value,
      this.$i18n
    );
  },
  watch: {
    value(val) {
      if (val instanceof Date)
        val = this.getLabel("time", { duration: false }, val, this.$i18n);
      this.changeTime(val);
    }
  },
  i18n: {
    messages: {
      en: {
        label: "Enter a time",
        invalid: "Invalid Time"
      },
      fr: {
        label: "Entrez une heure",
        invalid: "Heure Invalide"
      }
    }
  }
};
</script>
