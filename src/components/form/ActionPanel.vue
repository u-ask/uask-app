<template>
  <div>
    <span class="backAction">
      <v-btn
        id="backToParticipantList"
        class="ml-3 my-1"
        color="primary"
        @click="goToParticipantList"
        small
      >
        <v-icon>mdi-chevron-left</v-icon>
        {{ $t("back") }}
      </v-btn>
      <v-btn
        v-if="previousIndex != indexMax"
        id="previous"
        class="ml-3 my-1"
        @click="onPrevious"
        color="primary"
        small
      >
        <v-icon>mdi-chevron-left</v-icon>
        {{ $t("action.previous") }}
      </v-btn>
    </span>
    <template v-if="canContinue">
      <v-btn
        id="save"
        @click="onContinue"
        class="ml-3 my-1"
        color="primary"
        :disabled="saveDisabled"
        small
      >
        {{ $t("action.continue") }}
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  props: ["index", "indexMax", "saveDisabled"],
  computed: {
    nextIndex() {
      return this.index == this.indexMax ? 0 : this.index + 1;
    },
    previousIndex() {
      return this.index == 0 ? this.indexMax : this.index - 1;
    },
    canContinue() {
      return this.nextIndex > 0 && this.indexMax > 0 && !this.saveDisabled;
    }
  },
  methods: {
    onPrevious() {
      this.$emit("action", { index: this.previousIndex });
    },
    onContinue() {
      this.$emit("action", { index: this.nextIndex });
    },
    goToParticipantList() {
      this.$router.push({ name: "Search participant" });
    }
  },
  watch: {
    canContinue(val) {
      if (!this.isStudioMode && val)
        this.$el.scrollIntoView({ behavior: "smooth" });
    }
  },
  i18n: {
    messages: {
      en: {
        back: "Back to the Participant List"
      },
      fr: {
        back: "Retour à la liste des participants"
      }
    }
  }
};
</script>
