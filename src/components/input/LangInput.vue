<template>
  <v-select
    :items="langsAvailables"
    :value="value"
    @change="$emit('changeLang', $event)"
    class="pl-0"
  ></v-select>
</template>
<script>
export default {
  props: ["langsAvailables", "value"]
};
</script>
