<template>
  <div>
    <v-btn id="cancel" @click="onCancel" color="secondary">
      {{ $t("action.cancel") }}
    </v-btn>
    <template>
      <v-btn
        id="save"
        class="mx-3"
        color="primary"
        :disabled="saveDisabled"
        @click="onSave"
      >
        {{ $t("action.save") }}
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  props: ["index", "saveDisabled"],
  methods: {
    onSave() {
      this.$emit("action", { type: "save", index: this.index });
    },
    onCancel() {
      this.$emit("action", { type: "cancel", index: this.index });
    }
  }
};
</script>
