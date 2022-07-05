<template>
  <v-menu offset-y min-width="150">
    <template v-slot:activator="{ on, attrs }">
      <v-btn id="langSelector" color dark v-bind="attrs" v-on="on" icon>
        <v-avatar size="30">
          <img :src="currentLang ? currentLang.flag : ''" alt />
        </v-avatar>
      </v-btn>
    </template>
    <v-list-item-group id="lang" v-model="$i18n.locale">
      <v-list-item
        v-for="(item, index) of langs"
        :disabled="item.value == $i18n.locale"
        :key="index"
        :value="item.value"
        class="bg-light"
      >
        <v-list-item-title>
          <v-avatar class="mr-1" size="24">
            <img :src="item.flag" alt />
          </v-avatar>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-menu>
</template>

<script>
import langs from "../../mixin/langs.js";

export default {
  props: ["text"],
  computed: {
    currentLang() {
      return this.langs.find(e => e.value == this.$i18n.locale);
    }
  },
  mixins: [langs],
  mounted() {
    if (!this.langs.map(l => l.value).includes(this.$i18n.locale))
      this.$i18n.locale = this.currentSurvey?.options.defaultLang ?? "en";
    this.$i18n.fallbackLocale = this.currentSurvey?.options.defaultLang;
  }
};
</script>
