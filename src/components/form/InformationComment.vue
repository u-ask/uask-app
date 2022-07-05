<template>
  <v-tooltip
    v-if="comment"
    right
    :open-on-click="true"
    :open-on-hover="false"
    max-width="50%"
  >
    <template v-slot:activator="{ on }">
      <v-btn @click="on.click" icon>
        <v-icon
          :id="`infobtn-${pageItem.variableName}`"
          color="info"
          role="button"
          size="18"
          >mdi-information
        </v-icon>
      </v-btn>
    </template>
    <lang-label
      :id="`collapseinfo-${pageItem.variableName}`"
      :class="isFormula ? 'white--text formula-font' : 'white--text'"
      :labels="comment"
    ></lang-label>
  </v-tooltip>
</template>

<script>
import LangLabel from "../input/LangLabel";
export default {
  props: ["pageItem", "modifier", "classes"],
  components: {
    LangLabel
  },
  computed: {
    comment() {
      const itemComment = this.pageItem?.comment;
      if (
        this.classes ||
        this.modifier?.leftWording != undefined ||
        this.modifier?.rightWording != undefined
      )
        return this.modifier?.comment;
      return itemComment;
    },
    isFormula() {
      return !!this.classes?.includes("formula");
    }
  }
};
</script>

<style>
.formula-font {
  font-family: Arial, Helvetica, sans-serif !important;
}
</style>
