<template>
  <span :id="`input-group-date-period-${name}`">
    <span class="px-2">
      <simple-item-input
        :id="`input-date-period-start-${name}`"
        :wording="$t('from')"
        :name="name"
        :type="type"
        :value="start"
        @change="updateStart($event)"
      >
        <template v-slot:append>
          <clear-control
            :name="name"
            @clear="onClear(undefined, end)"
          ></clear-control>
        </template>
      </simple-item-input>
    </span>
    <span>
      <simple-item-input
        :id="`input-date-period-end-${name}`"
        :wording="$t('to')"
        :name="name"
        :type="type"
        :value="end"
        @change="updateEnd($event)"
      >
        <template v-slot:append>
          <clear-control
            :name="name"
            @clear="onClear(start, undefined)"
          ></clear-control>
        </template>
      </simple-item-input>
    </span>
  </span>
</template>

<script>
import SimpleItemInput from "../form/SimpleItemInput.vue";
import ClearControl from "../input/ClearControl.vue";
export default {
  components: { SimpleItemInput, ClearControl },
  props: ["name", "wording", "type", "value"],
  data() {
    return {
      start: undefined,
      end: undefined
    };
  },
  computed: {
    currentValue() {
      return {
        start: this.start,
        end: this.end
      };
    }
  },
  methods: {
    updateStart(start) {
      this.start = start;
      this.sendFilter();
    },
    updateEnd(end) {
      this.end = end;
      this.sendFilter();
    },
    onClear(start, end) {
      this.start = start;
      this.end = end;
      if (start === undefined && end === undefined) {
        this.$emit("input", undefined);
        this.$emit("change", undefined);
      } else this.sendFilter();
    },
    sendFilter() {
      this.$emit("input", this.currentValue);
      this.$emit("change", this.currentValue);
    },
    loadFilter() {
      const value = this.$route.query[this.name]
        ? JSON.parse(this.$route.query[this.name])
        : undefined;
      this.start = value?.start;
      this.end = value?.end;
      if (this.start !== undefined || this.end !== undefined) this.sendFilter();
    }
  },
  mounted() {
    this.loadFilter();
  },
  i18n: {
    messages: {
      en: {
        from: "From",
        to: "to"
      },
      fr: {
        from: "Du",
        to: "au"
      }
    }
  }
};
</script>
