<template>
  <div class="d-flex justify-space-evenly">
    <div :id="`clearcontrol${name}`" class="d-flex align-lg-center col-2 pl-0">
      <v-icon
        slot="append"
        @click="onClick()"
        class="align-self-center clearcontrol"
      >
        mdi-close
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name"],
  methods: {
    onClick() {
      this.$emit("clear", { name: this.name });
    }
  }
};
</script>

<style scoped>
.clearcontrol:hover {
  color: #dc3545;
  cursor: pointer;
}
</style>
