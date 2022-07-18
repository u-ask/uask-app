<template>
  <v-card outlined>
    <v-card-title>
      <v-avatar size="100" class="mr-2">
        <img src="/img/001-man.svg" alt="" />
      </v-avatar>
      <span class="d-flex flex-column ml-4">
        <h3>
          {{ currentUser.title }} {{ currentUser.firstName }}
          {{ currentUser.name }}
        </h3>
        <h5>{{ $t(role) }}</h5>
      </span>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-btn
        id="continue"
        block
        color="primary"
        @click.prevent="gotoParticipantList"
        >{{ $t("continue") }}</v-btn
      >
    </v-card-text>
    <v-card-text>
      <user-inputs
        :user="currentUser"
        @save="saveUser($event)"
        @cancel="$router.go()"
        :actions="true"
      ></user-inputs>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import UserInputs from "../admin/UserInputs.vue";
export default {
  computed: {
    ...mapGetters("auth", ["role"])
  },
  methods: {
    gotoParticipantList() {
      this.$router.push({ name: "Search participant" });
    },
    async saveUser(user) {
      await this.drivers.userDriver.save(this.currentSurvey, user);
      this.$router.go();
    }
  },
  components: {
    UserInputs
  },
  i18n: {
    messages: {
      en: {
        administrator: "Administrator",
        associate: "Associate",
        investigator: "Investigator",
        participant: "Participant",
        continue: "Continue to participant list"
      },
      fr: {
        administrator: "Administrateur",
        associate: "ARC",
        investigator: "Investigateur",
        participant: "Participant",
        continue: "Continuer vers la liste des participants"
      }
    }
  }
};
</script>
