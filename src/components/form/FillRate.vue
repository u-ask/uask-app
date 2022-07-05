<template>
  <v-progress-linear
    :color="color ? `#${color}` : 'primary'"
    rounded
    :value="value * 100"
    :height="height ? `${height}em` : '1em'"
  >
    <strong class="white--text">{{ valueInpercent }} - {{ text }}</strong>
  </v-progress-linear>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    color: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    },
    height: {
      type: Number,
      required: false
    }
  },
  computed: {
    valueInpercent() {
      const result = this.value * 100;
      return `${Math.round(result)}%`;
    }
  }
};
</script>
