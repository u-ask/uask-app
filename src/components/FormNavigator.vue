<template>
  <div class="d-flex align-center">
    <pageSet-picker></pageSet-picker>
    <edit-page-set-button
      v-if="isStudioMode && displayStudio && !isHomePage"
      class="ml-2"
    ></edit-page-set-button>
    <delete-pageset-button
      v-if="isStudioMode && displayStudio && !isHomePage"
      class="ml-2"
    ></delete-pageset-button>
    <v-divider
      v-if="isStudioMode && displayStudio"
      vertical
      class="ml-2"
    ></v-divider>
    <insert-page-set-button
      v-if="isStudioMode && displayStudio"
      class="ml-2"
    ></insert-page-set-button>
  </div>
</template>

<script>
import PageSetPicker from "./form/PageSetPicker.vue";
import EditPageSetButton from "../components/studio/EditPageSetButton.vue";
import DeletePagesetButton from "../components/studio/DeletePagesetButton.vue";
import InsertPageSetButton from "../components/studio/InsertPageSetButton.vue";
import workflows from "@/mixin/workflows.js";

export default {
  props: ["displayStudio"],
  mixins: [workflows],
  components: {
    PageSetPicker,
    EditPageSetButton,
    InsertPageSetButton,
    DeletePagesetButton
  }
};
</script>
