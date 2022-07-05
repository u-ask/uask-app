<template>
  <div>
    <v-snackbar
      :value="showFulfilled"
      color="success"
      top
      v-if="!isStudioMode && currentPage && hasamplems"
    >
      {{ $t("fulfilled") }}
    </v-snackbar>
    <base-card no-body v-if="currentPageSet.pages">
      <v-card-title :class="{ 'px-0 py-0': mobile }">
        <page-panel></page-panel>
      </v-card-title>
      <v-card-text>
        <page-details>
          <template v-slot:footer>
            <slot name="footer"></slot>
          </template>
        </page-details>
      </v-card-text>
    </base-card>
  </div>
</template>

<script>
import PagePanel from "./PagePanel";
import PageDetails from "./PageDetails";
import BaseCard from "@/arctic/components/base/Card";
export default {
  data() {
    return {
      showFulfilled: false
    };
  },
  computed: {
    hasamplems() {
      return this.currentPageSet?.pages.map(p => p.items).length > 0;
    }
  },
  watch: {
    "currentInterview.status"(status) {
      this.showFulfilled = status == "fulfilled";
    }
  },
  components: {
    PagePanel,
    PageDetails,
    BaseCard
  },
  i18n: {
    messages: {
      en: {
        fulfilled: "Questionnaire fulfilled"
      },
      fr: {
        fulfilled: "Questionnaire terminé"
      }
    }
  }
};
</script>
