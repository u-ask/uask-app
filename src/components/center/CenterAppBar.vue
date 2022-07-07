<template>
  <v-app-bar
    color="#2a2f45"
    class="px-sm text-left shadow-sm"
    :height="mobile ? '80' : '130'"
    flat
    absolute
  >
    <span v-if="!$vuetify.breakpoint.xsOnly">
      <a href="/">
        <img
          v-if="!$vuetify.breakpoint.smAndDown"
          src="/img/logo.svg"
          height="70px"
          alt="logo arone"
        />
      </a>
    </span>
    <v-spacer v-if="!mobile"></v-spacer>
    <v-chip outlined color="white">
      <v-icon class="mr-3">mdi-account</v-icon>
      {{ title }} {{ givenName }} {{ surname }}
    </v-chip>
    <v-spacer v-if="mobile"></v-spacer>
    <lang-selector></lang-selector>
    <logout-control class="ml-2"></logout-control>
  </v-app-bar>
</template>

<script>
import LangSelector from "../user/LangSelector.vue";
import { mapGetters } from "vuex";
import LogoutControl from "../user/LogoutControl.vue";
export default {
  components: { LangSelector, LogoutControl },
  computed: {
    ...mapGetters("auth", ["title", "givenName", "surname"])
  }
};
</script>
