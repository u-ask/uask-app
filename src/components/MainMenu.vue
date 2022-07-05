<template>
  <nav-bar></nav-bar>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import { mapGetters } from "vuex";
import NavBar from "./NavBar.vue";

export default {
  computed: {
    ...mapGetters("navigation", ["navOptions"])
  },
  methods: {
    home: function() {
      this.$router.push({ name: "Home" });
    }
  },
  i18n: {
    messages: {
      en: { home: "Home" },
      fr: { home: "Accueil" }
    }
  },
  components: {
    NavBar
  }
};
</script>
