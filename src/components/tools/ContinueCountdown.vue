<template>
  <v-btn
    id="save"
    block
    outlined
    @click="$emit('click', $event)"
    :disabled="!!continueDelay"
    color="primary"
  >
    <div style="width: 2em;" v-if="!!continueDelay" class="light--text">
      {{ continueDelay }}
    </div>
    {{ $t("action.continue") }}
    <v-icon>mdi-chevron-right</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: ["delay"],
  data() {
    return {
      continueDelay: this.delay
    };
  },
  beforeMount() {
    const i = setInterval(() => {
      this.continueDelay--;
      if (this.continueDelay == 0) {
        clearInterval(i);
      }
    }, 1000);
  }
};
</script>
