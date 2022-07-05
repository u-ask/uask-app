<template>
  <div>
    <v-btn outlined v-if="show" color="danger" @click="onClick()">
      {{ $t("action.cancel") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: ["show"],
  inject: ["delaySaveItems", "cancelSaveItems", "resumeSaveItems"],
  methods: {
    async onClick() {
      await this.cancelSaveItems();
    }
  },
  watch: {
    async show(val) {
      if (val)
        await this.delaySaveItems(15000).then(({ __canceled__ }) => {
          this.$emit("done", __canceled__);
        });
    }
  },
  async beforeDestroy() {
    if (this.show) await this.resumeSaveItems();
  }
};
</script>
