<template>
  <v-alert
    border="left"
    elevation="1"
    colored-border
    :color="!isStudioSection ? 'primary' : 'info'"
    :class="{
      section: title,
      'studio-section': isStudioSection
    }"
    class="section-div"
    v-show="visible"
  >
    <div class="m-2">
      <lang-label class="title" :labels="title" v-if="title"></lang-label>
      <v-divider v-if="title"></v-divider>
      <div>
        <slot></slot>
      </div>
    </div>
  </v-alert>
</template>

<script>
import LangLabel from "../input/LangLabel";

export default {
  props: ["title", "visible"],
  components: {
    LangLabel
  },
  i18n: {
    messages: {
      en: {
        rawSection: "Modify tables in section"
      },
      fr: {
        rawSection: "Modifier les tableaux dans la section"
      }
    }
  }
};
</script>
<style>
.studio-section {
  background-color: #e9ddff !important;
}
</style>
