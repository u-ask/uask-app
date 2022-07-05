<template>
  <div>
    <v-chip
      small
      v-if="!!criticalMessage"
      class="mr-2 mb-1"
      color="pink"
      label
      text-color="white"
    >
      <v-icon left>
        mdi-label
      </v-icon>
      {{ criticalMessage }}
    </v-chip>
    <div
      v-for="[name, msg, ack] in nonCriticalMessages"
      :key="name"
      class="d-inline-flex msg mr-2 mb-1 ack"
      @click="ack ? reiterate(name) : acknowledge(name)"
    >
      <v-chip small :color="ack ? 'light' : 'danger'" outlined>
        <v-icon small v-if="!ack">
          mdi-checkbox-blank-circle-outline
        </v-icon>
        <v-icon small v-else>
          mdi-checkbox-marked-circle-outline
        </v-icon>
        <span class="ml-1">{{ msg }}</span></v-chip
      >
    </div>
  </div>
</template>

<style scoped>
.ack {
  cursor: pointer;
}
</style>

<script>
import { acknowledge, messageEntries, reiterate } from "uask-dom";

export default {
  props: ["messages"],
  computed: {
    criticalMessage() {
      return this.allMessages.find(m => m[0] == "critical")?.[1];
    },
    nonCriticalMessages() {
      return this.allMessages.filter(m => m[0] != "critical");
    },
    allMessages() {
      return messageEntries(this.messages);
    }
  },
  methods: {
    acknowledge(name) {
      this.$emit("change", acknowledge(this.messages, name));
    },
    reiterate(name) {
      this.$emit("change", reiterate(this.messages, name));
    }
  }
};
</script>
