<template>
  <v-row>
    <v-col cols="12" :class="{ 'pt-0': mobile }">
      <alert-list></alert-list>
    </v-col>
  </v-row>
</template>

<script>
import AlertList from "../components/monitoring/AlertList";

export default {
  components: {
    AlertList
  }
};
</script>
