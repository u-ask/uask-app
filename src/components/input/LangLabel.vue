<template>
  <strong>{{ label }}</strong>
</template>

<script>
export default {
  props: ["labels"],
  computed: {
    label() {
      return this.getLabel("mlstring", {}, this.labels, this.$i18n);
    }
  }
};
</script>
