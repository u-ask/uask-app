<template>
  <div class="d-md-inline-flex align-center" style="height: 100%">
    <v-divider
      vertical
      v-for="n in pad"
      :key="`pad-${n}`"
      class="mx-5"
      style="display: inline"
    ></v-divider>
  </div>
</template>

<script>
export default {
  props: ["classes"],
  computed: {
    pad() {
      const padClass = this.classes?.find(c => c.includes("pad"));
      return padClass
        ? padClass == "pad"
          ? 1
          : Number(/pad([0-9])/.exec(padClass)[1])
        : 0;
    }
  }
};
</script>

<style>
.v-divider--vertical {
  height: 50px !important;
}
</style>
