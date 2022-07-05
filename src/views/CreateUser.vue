<template>
  <v-card>
    <v-card-title>
      <div class="pt-3 pl-2">{{ $t("newUser") }}</div>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <user-inputs
        :actions="true"
        @save="createUser($event)"
        @cancel="cancelCreation()"
      ></user-inputs>
    </v-card-text>
  </v-card>
</template>

<script>
import UserInputs from "../components/admin/UserInputs.vue";
export default {
  methods: {
    cancelCreation() {
      this.$router
        .push({
          name: "Admin users",
          query: { survey: this.currentSurvey.name }
        })
        .catch(() => {});
    },
    async createUser(user) {
      await this.drivers.userDriver.save(this.currentSurvey, user).catch(err => {
        Array.isArray(err)
          ? err.map(error => this.setError(error))
          : this.setError(err);
      });
      this.$router.push({
        name: "Admin users",
        query: { survey: this.currentSurvey.name }
      });
    }
  },
  components: { UserInputs },
  i18n: {
    messages: {
      en: {
        newUser: "Create a new user on survey"
      },
      fr: {
        newUser: "Créer un nouvel utilisateur sur l'étude"
      }
    }
  }
};
</script>
