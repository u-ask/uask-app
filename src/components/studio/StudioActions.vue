<template>
  <div class="col p-0 text-right">
    <v-btn
      @click="save()"
      color="primary"
      rounded
      class="mr-2"
      :disabled="!canApply || wait"
      id="save-studio"
    >
      {{ $t("action.save") }}
      <v-progress-circular
        class="ml-1"
        indeterminate
        color="primary"
        v-show="wait"
      >
      </v-progress-circular>
    </v-btn>
    <v-btn
      @click="cancel()"
      color="primary"
      id="cancel-studio"
      outlined
      rounded
      >{{ $t("action.cancel") }}</v-btn
    >
  </div>
</template>

<script>
import studioState from "../../mixin/studioState";

export default {
  data() {
    return {
      wait: false
    };
  },
  methods: {
    save() {
      this.$emit("save", undefined);
      this.wait = true;
    }
  },
  watch: {
    pendingStudioModification(val) {
      if (val === false) this.wait = false;
    }
  },
  mixins: [studioState]
};
</script>
