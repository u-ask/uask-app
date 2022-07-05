<template>
  <div>
    <v-btn
      block
      id="logout"
      href=""
      @click.prevent="logout"
      text
      color="danger"
      :icon="mobile"
    >
      <span v-if="!mobile">{{ $t("logout") }}</span>
      <v-icon v-else>mdi-power</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  computed: {
    survey() {
      return this.$route.params.survey ?? this.$route.query.survey;
    }
  },
  methods: {
    logout: function() {
      this.$router.push({
        name: "CallbackLogout",
        query: { survey: this.survey, start: true }
      });
    }
  },
  i18n: {
    messages: {
      en: {
        logout: "Logout"
      },
      fr: {
        logout: "Déconnexion"
      }
    }
  }
};
</script>
