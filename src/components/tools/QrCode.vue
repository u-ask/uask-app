<template>
  <div v-if="url">
    <div class="d-flex">
      <print-button :compact="true" element="magic" class="mx-5">
      </print-button>
      <div id="magic">
        <div class="print">
          <h3>
            Utilisez le QR Code pour vous connecter à l'étude
            {{ currentSurvey.name }}
          </h3>
        </div>
        <qrcode-vue :value="url"></qrcode-vue>
        <div class="print">
          <a :href="url">{{ url }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import PrintButton from "./PrintButton.vue";

export default {
  props: ["url"],
  components: {
    QrcodeVue,
    PrintButton
  }
};
</script>

<style scoped>
.print {
  display: none;
}

@media print {
  .print {
    display: block;
  }
}
</style>
