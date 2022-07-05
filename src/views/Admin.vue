<template>
  <v-container class="horizontal-container rounded-lg relative bg-primary">
    <v-snackbar v-model="showAlert" color="danger" top>
      {{ $t("needSave") }}
    </v-snackbar>
    <v-expand-transition mode="out-in">
      <router-view />
    </v-expand-transition>
  </v-container>
</template>

<script>
import VueRouter from "vue-router";

const pushRoute = VueRouter.prototype.push;

export default {
  name: "Admin",
  data() {
    return {
      showAlert: false
    };
  },
  methods: {
    needSave(value) {
      if (value) VueRouter.prototype.push = this.alert;
      else VueRouter.prototype.push = pushRoute;
    },
    alert() {
      this.showAlert = true;
    }
  },
  provide() {
    return {
      needSave: this.needSave
    };
  },
  i18n: {
    messages: {
      en: {
        needSave: "Save or cancel your changes before leaving"
      },
      fr: {
        needSave: "Saugegardez ou annulez vos modification avant de quitter"
      }
    }
  }
};
</script>
