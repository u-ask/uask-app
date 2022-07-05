<template>
  <v-card outlined>
    <v-card-title class="pb-0">
      <div
        class="align-basline justify-space-between col pl-2 pb-0 pt-3"
        :class="{ 'd-flex': !mobile }"
      >
        <div>{{ $t($route.name.split(" ").join("")) }}</div>
        <v-btn
          color="primary"
          class="mb-3 align-self-right"
          elevation="0"
          outlined
          @click="newUser()"
          :block="mobile"
        >
          {{ $t("createUser") }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text :class="{ 'px-0': mobile }">
      <v-divider></v-divider>
      <user-list></user-list>
    </v-card-text>
  </v-card>
</template>

<script>
import UserList from "../components/admin/UserList.vue";
export default {
  methods: {
    newUser() {
      this.$router.push({
        name: "Admin create user"
      });
    }
  },
  components: { UserList },
  i18n: {
    messages: {
      en: {
        Adminusers: "Users administration",
        createUser: "Add user"
      },
      fr: {
        Adminusers: "Administration des utilisateurs de l'étude",
        createUser: "Ajouter un utilisateur"
      }
    }
  }
};
</script>
