<template>
  <v-alert text :color="color">
    <div text :color="color" :class="{ 'd-inline-flex col-12': !mobile }">
      <span>{{ message }}</span>
      <v-btn
        small
        color="light"
        :class="{ 'ml-3': !mobile, 'mt-2': mobile }"
        :block="mobile"
        depressed
        @click="resend()"
      >
        {{ label }}
      </v-btn>
      <v-spacer></v-spacer>
      <slot></slot>
    </div>
  </v-alert>
</template>

<script>
export default {
  props: ["message", "label", "color"],
  methods: {
    resend() {
      this.$emit("resend");
    }
  }
};
</script>

<style></style>
