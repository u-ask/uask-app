<template>
  <v-row>
    <v-col cols="12">
      <user-profile></user-profile>
    </v-col>
  </v-row>
</template>

<script>
import UserProfile from "../components/user/UserProfile";
export default {
  components: {
    UserProfile
  }
};
</script>
