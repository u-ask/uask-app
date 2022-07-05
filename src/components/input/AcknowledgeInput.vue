<template>
  <div class="d-flex align-center">
    <studio-actions
      v-if="isStudioApply"
      @save="applyModification()"
    ></studio-actions>
    <v-checkbox
      v-else
      class="mr-2 pt-0"
      :input-value="value"
      @change="$emit('change', getValue($event))"
    ></v-checkbox>
  </div>
</template>

<script>
import StudioActions from "../studio/StudioActions.vue";
export default {
  components: { StudioActions },
  props: ["value", "classes"],
  methods: {
    getValue(v) {
      return v ? true : undefined;
    },
    applyModification() {
      this.$emit("change", true);
    }
  }
};
</script>
