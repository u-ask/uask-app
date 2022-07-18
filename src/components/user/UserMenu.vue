<template>
  <v-menu offset-y left class="ml-2">
    <template v-slot:activator="{ on, attrs }">
      <v-btn id="userMenu" color dark v-bind="attrs" v-on="on" icon>
        <v-avatar size="30">
          <img src="/img/001-man.svg" alt="" />
        </v-avatar>
      </v-btn>
    </template>
    <div class="p-3 bg-white">
      <div class="flex items-center mb-10">
        <v-avatar size="56">
          <img src="/img/001-man.svg" alt="" />
        </v-avatar>
        <div class="float-right">
          <div class="m--5">
            {{ name }}
          </div>
          <div id="role" class="m--5 small">
            <em>{{ $t(`roles.${role}`) }}</em>
          </div>
        </div>
      </div>
      <toggle-studio
        v-if="isInRole('developer') && $route.name != 'Participant creation'"
      ></toggle-studio>
      <v-btn
        block
        id="userProfile"
        text
        outlined
        color="primary"
        :href="`/${currentSurvey.name}/user`"
        class="mb-2"
      >
        {{ $t("userProfile") }}
      </v-btn>
      <logout-control></logout-control>
    </div>
  </v-menu>
</template>

<style scoped>
.m--5 {
  margin: -5px 0 -5px 0;
}
</style>

<script>
import "bootstrap/dist/css/bootstrap.css";
import { mapMutations, mapGetters } from "vuex";
import ToggleStudio from "../studio/ToggleStudio.vue";
import LogoutControl from "./LogoutControl.vue";

export default {
  components: {
    ToggleStudio,
    LogoutControl
  },
  computed: {
    ...mapGetters("auth", ["role", "surname", "givenName", "isInRole"]),

    prod() {
      return process.env.VUE_APP_ENV == "prod";
    },
    name() {
      return this.givenName ? `${this.givenName} ${this.surname}` : "";
    },
    survey() {
      return this.$route.params.survey ?? this.$route.query.survey;
    }
  },
  methods: {
    ...mapMutations("auth", ["clearAccessToken"])
  },
  i18n: {
    messages: {
      en: {
        administrator: "Administrator",
        associate: "Associate",
        investigator: "Investigator",
        participant: "Participant",
        userProfile: "User Profile",
        studioMode: "Studio Mode"
      },
      fr: {
        administrator: "Administrateur",
        associate: "ARC",
        investigator: "Investigateur",
        participant: "Participant",
        userProfile: "Profil",
        studioMode: "Mode Studio"
      }
    }
  }
};
</script>
