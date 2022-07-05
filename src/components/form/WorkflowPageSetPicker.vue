<template>
  <div v-if="pagesets.length" class="bg-white">
    <v-divider class="bg-white"></v-divider>
    <v-list-item
      :id="`workflow${index}`"
      name="workflow"
      v-for="(pageSet, index) in pagesets"
      :key="index"
      :data-index="index"
      @click="$emit('pageset-picked', pageSet)"
    >
      <lang-label :labels="pageSet.type"></lang-label>
      <v-icon class="ml-2" color="success">mdi-plus-circle</v-icon>
    </v-list-item>
  </div>
</template>

<script>
import LangLabel from "../input/LangLabel";

export default {
  props: ["pagesets", "id"],
  components: {
    LangLabel
  }
};
</script>
