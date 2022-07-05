<template>
  <span
    v-if="!isStudioMode"
    class="d-inline-flex align-center status ml-2"
    :data-status="status"
  >
    <v-icon :color="color" :size="small ? '18' : 'auto'">{{ icon }}</v-icon>
  </span>
</template>

<script>
export default {
  props: { status: String, small: Boolean },
  computed: {
    icon() {
      switch (this.status) {
        case "fulfilled":
          return "mdi-checkbox-marked-circle";
        case "missing":
        case "incomplete":
          return "mdi-alert-circle";
        case "insufficient":
          return "mdi-close-circle";
        case "empty":
          return "mdi-close-circle";
        default:
          return undefined;
      }
    },
    color() {
      switch (this.status) {
        case "fulfilled":
          return "success";
        case "missing":
        case "incomplete":
          return "warning";
        case "insufficient":
          return "danger";
        case "empty":
          return "#718096";
        default:
          return undefined;
      }
    }
  }
};
</script>
