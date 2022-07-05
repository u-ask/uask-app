<template>
  <v-slider
    step="1"
    class="my-7 sb-inline"
    :disabled="disabled"
    :value="value"
    :min="type.min"
    :max="type.max"
    @change="send($event)"
    color="success"
    thumb-label="always"
    thumb-color="success"
    tick-size="6"
    ticks="always"
  >
    <span slot="append">
      <slot name="append"></slot>
    </span>
  </v-slider>
</template>

<script>
export default {
  props: ["value", "disabled", "type"],
  methods: {
    send(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style>
.v-messages {
  min-height: 0;
}
</style>
