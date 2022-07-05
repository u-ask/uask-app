<template>
  <div>
    <div class="d-lg-inline-flex align-center col">
      <v-text-field
        :value="hours"
        :disabled="disabled"
        @change="changeHours($event)"
        @blur="onBlur()"
        type="number"
        class="text--right"
        min="0"
        outlined
        dense
        :hide-details="true"
      >
        <span slot="append-outer">{{ $t("hours") }}</span>
      </v-text-field>
      <v-text-field
        :value="minutes"
        :disabled="disabled"
        @change="changeMinutes($event)"
        @blur="onBlur()"
        type="number"
        class="ml-lg-8"
        min="0"
        outlined
        dense
        :hide-details="true"
      >
        <span slot="append-outer">{{ $t("minutes") }}</span>
      </v-text-field>
    </div>
    <div class="text-center col border rounded dense mt-0 py-0">
      {{ getLabel("time", { duration: true }, intValue, $i18n) }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "disabled", "type"],
  data() {
    return {
      hours: 0,
      minutes: 0
    };
  },
  computed: {
    intValue() {
      return typeof this.value == "string"
        ? parseInt(this.value)
        : typeof this.value == "number"
        ? this.value
        : 0;
    }
  },
  methods: {
    changeHours(hours) {
      this.hours = hours != "" ? parseInt(hours) : 0;
    },
    changeMinutes(minutes) {
      this.minutes = minutes != "" ? parseInt(minutes) : 0;
    },
    onBlur() {
      this.$emit("change", this.minutes + this.hours * 60);
    }
  },
  mounted() {
    this.minutes = this.intValue % 60;
    this.hours = Math.trunc(this.intValue / 60);
  },
  watch: {
    value(val) {
      if (val == undefined) {
        this.hours = undefined;
        this.minutes = undefined;
      }
    }
  },
  i18n: {
    messages: {
      en: {
        hours: "Hours",
        minutes: "Min."
      },
      fr: {
        hours: "Heures",
        minutes: "Min."
      }
    }
  }
};
</script>
