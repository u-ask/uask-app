<template>
  <div v-if="isStudioMode" class="col d-inline-flex align-center">
    <div class="mr-3">{{ $t("studioMode") }}</div>
    <v-switch
      @change="showInvisible($event)"
      id="show-invisible-toggle"
    ></v-switch>
  </div>
</template>

<script>
import studioState from "../../mixin/studioState";
export default {
  methods: {
    showInvisible(event) {
      this.setShowInvisibleItems(!!event);
    }
  },
  mixins: [studioState],
  i18n: {
    messages: {
      en: {
        studioMode: "Show non visible items"
      },
      fr: {
        studioMode: "Afficher les items non visibles"
      }
    }
  }
};
</script>

<style></style>
