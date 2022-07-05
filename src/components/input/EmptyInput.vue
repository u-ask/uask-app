<template>
  <div :id="`input-empty-fields-${name}`" class="d-flex align-center mx-1">
    <span class="mr-1"> {{ $t("label") }} </span>
    <v-checkbox
      class="pt-0"
      :value="checked"
      @change="onChange($event)"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  props: ["name", "value"],
  data() {
    return {
      checked: false
    };
  },
  methods: {
    onChange(val) {
      val ? this.$emit("change", "undefined") : this.$emit("change", undefined);
    }
  },
  mounted() {
    this.checked = this.value === "undefined" ? true : false;
  },
  i18n: {
    messages: {
      en: {
        label: "Empty data"
      },
      fr: {
        label: "Données vides"
      }
    }
  }
};
</script>
