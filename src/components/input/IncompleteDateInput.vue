<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="11">
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <v-text-field
            id="year"
            v-if="showYear"
            :value="year"
            type="number"
            :placeholder="$t('year')"
            :disabled="disabled"
            @input="updateYear($event)"
            @blur="onBlur()"
            ref="year"
            class="pt-0"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="py-0">
          <v-text-field
            id="month"
            v-if="showMonth"
            :value="month"
            :placeholder="$t('month')"
            :disabled="disabled"
            @input="updateMonth($event)"
            @blur="onBlur()"
            ref="month"
            class="pt-0"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="py-0">
          <v-text-field
            id="day"
            v-if="showDay"
            :value="day"
            :placeholder="$t('day')"
            :disabled="disabled"
            @input="updateDay($event)"
            @blur="onBlur()"
            ref="day"
            class="pt-0"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="1">
      <v-tooltip bottom color="dark">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-show="!isValid" color="danger" v-bind="attrs" v-on="on">
            mdi-alert-circle
          </v-icon>
        </template>
        <span>{{ $t("invalid") }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<style scoped>
.cleardate:hover {
  color: #dc3545;
}
</style>
<script>
export default {
  props: {
    value: {
      required: true
    },
    disabled: {
      default: false
    },
    showDay: {
      type: Boolean,
      default: true
    },
    showMonth: {
      type: Boolean,
      default: true
    },
    showYear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      year: "",
      month: "",
      day: ""
    };
  },
  computed: {
    isValid() {
      const val = this.currentValue;
      if (val == "") return true;
      const s =
        val.length == 4 ? `${val}-01-01` : val.length == 7 ? `${val}-01` : val;
      const d = new Date(s);
      return !isNaN(d.valueOf()) && d.toISOString().startsWith(s);
    },
    currentValue() {
      const y = this.year ?? "";
      const m = this.n(this.month);
      if (this.showDay) {
        const d = this.n(this.day);
        return `${y}${m ? `-${m}${d ? `-${d}` : ""}` : ""}`;
      }
      return `${y}${m ? `-${m}` : ""}`;
    }
  },
  methods: {
    updateDay(day) {
      this.day = day;
      this.onBlur();
    },
    updateMonth(month) {
      const m = Number(month);
      if (this.showDay && ((m > 1 && m < 13) || month == "01"))
        this.$refs.day.focus();
      this.month = month;
      this.onBlur();
    },
    updateYear(year) {
      const y = Number(year);
      if (y > 1800 && y < 3000) this.$refs.month.focus();
      this.year = year;
    },
    onBlur() {
      if (this.isValid) this.$emit("change", this.currentValue);
    },
    n(e, size = 2) {
      if (!e) return e;
      return `00000${e}`.substr(-size);
    },
    dateSplit() {
      const dateArray = this.value?.split("-").map(c => {
        const n = Number(c);
        return isNaN(n) ? "" : c;
      }) ?? ["", "", ""];
      this.year = dateArray[0];
      this.month = dateArray[1];
      this.day = dateArray[2];
    }
  },
  watch: {
    value() {
      this.dateSplit();
    }
  },
  mounted() {
    this.dateSplit();
  },
  i18n: {
    messages: {
      en: {
        day: "dd",
        month: "mm",
        year: "yyyy",
        invalid: "invalid date"
      },
      fr: {
        day: "jj",
        month: "mm",
        year: "aaaa",
        invalid: "date invalide"
      }
    }
  }
};
</script>

<!--Hide Arrows From Input Number-->
<style>
/* Chrome, Safari, Edge, Opera */
#year::-webkit-outer-spin-button,
#year::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
#year {
  -moz-appearance: textfield;
}
</style>
