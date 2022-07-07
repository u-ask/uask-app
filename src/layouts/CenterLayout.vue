<template>
  <div class="d-flex">
    <v-snackbar
      :value="showSnackBar"
      color="error"
      @input="snackbarHandle($event)"
      top
    >
      <div v-for="(error, index) in errors" :key="index">{{ error }}</div>
    </v-snackbar>
    <center-app-bar></center-app-bar>
    <v-main app class="col mt-12">
      <div class="d-inline-flex relative col px-0">
        <v-container class="horizontal-container rounded-lg col-12 mt-20">
          <survey-center></survey-center>
        </v-container>
      </div>
    </v-main>
  </div>
</template>

<script>
import CenterAppBar from "../components/center/CenterAppBar.vue";
import SurveyCenter from "../views/SurveyCenter.vue";
export default {
  components: { CenterAppBar, SurveyCenter },
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

<style>
.container {
  background: #323853 !important;
  height: 100% !important;
}

.v-application--wrap {
  height: 100% !important;
  background: #323853 !important;
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
