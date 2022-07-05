<template>
  <div class="d-md-inline-flex align-center">
    <padding :classes="classes" v-if="!isTitle"></padding>
    <div>
      <span class="d-flex flex-row align-center">
        <slot name="pre-wording"></slot>
        <div v-if="isTitle" class="mt-10 text-uppercase">
          <lang-label :labels="labels"></lang-label>
          <v-divider class="m-0 py-2"></v-divider>
        </div>
        <div
          v-html="label"
          class="md-0 py-2"
          :class="{
            'info-label': !hasMD,
            'info-md': hasMD,
            'flex-column': mobile
          }"
          v-else
        ></div>
      </span>
    </div>
    <div
      v-if="isStudioMode && !isStudioElement"
      class="mx-4 d-flex align-center"
    >
      <v-divider vertical></v-divider>
      <edit-item-button :item="pageItem" class="ml-4"></edit-item-button>
      <delete-item-button :item="pageItem" class="ml-4"></delete-item-button>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import LangLabel from "../input/LangLabel.vue";
import Padding from "./Padding.vue";
import EditItemButton from "../studio/EditItemButton.vue";
import DeleteItemButton from "../studio/DeleteItemButton.vue";

const sanitizeOptions = {
  ...sanitizeHtml.defaults,
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt"],
    ol: ["start"]
  }
};

export default {
  components: { LangLabel, Padding, EditItemButton, DeleteItemButton },
  props: ["labels", "classes", "pageItem"],
  computed: {
    isTitle() {
      return !!this.classes?.includes("title");
    },
    hasMD() {
      return this.classes?.includes("md") || false;
    },
    label() {
      const m = this.getLabel("mlstring", {}, this.labels, this.$i18n);
      const md = marked;
      return sanitizeHtml(md.parse(m), sanitizeOptions).replace(
        /<a href/g,
        "<a target=_blank href"
      );
    }
  }
};
</script>

<style>
.info-md {
  display: flex;
  font-size: 120%;
}
.info-md img {
  max-height: 100%;
}
.info-md > p {
  padding-right: 1rem;
  width: 100%;
  font: inherit !important;
  margin-bottom: 0 !important;
}
.info-label p {
  font-weight: 900 !important;
  font-style: italic;
  margin-bottom: 0 !important;
}
</style>
