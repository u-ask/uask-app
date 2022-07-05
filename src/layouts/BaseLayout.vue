<template>
  <div>
    <v-snackbar
      :value="showSnackBar"
      color="error"
      @input="snackbarHandle($event)"
      top
    >
      {{ errors }}
    </v-snackbar>
    <app-bar></app-bar>
    <v-main app>
      <v-container
        class="horizontal-container rounded-lg relative bg-gray-100"
        :class="{ 'mt-20': mobile, 'mt-32': !mobile }"
      >
        <nav-bar class="mb-4"></nav-bar>
        <v-expand-transition mode="out-in">
          <router-view />
        </v-expand-transition>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AppBar from "../components/AppBar.vue";
import NavBar from "../components/NavBar.vue";

export default {
  components: {
    NavBar,
    AppBar
  },
  computed: {
    showSnackBar() {
      return this.currentErrors.length != 0;
    },
    errors() {
      return this.currentErrors;
    }
  },
  methods: {
    snackbarHandle(event) {
      if (event == false) this.clearErrors();
    }
  }
};
</script>

<style lang="scss">
.v-main__wrap {
  flex: 1 1 auto !important;
  max-width: 100% !important;
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
}
.horizontal-container {
  z-index: 1;
}
.container {
  max-width: 1440px !important;
}

.v-input__slot {
  margin-bottom: 0px !important;
}

.mt-20 {
  margin-top: 5rem;
}
.mt-32 {
  margin-top: 8rem;
}
.bg-gray-100 {
  background-color: rgb(248 250 252);
}
</style>
