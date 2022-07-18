import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import mixin from "./mixin/index.js";
import studio from "./mixin/studio.js";
import state from "./mixin/state.js";
import i18n from "./i18n.js";
import vuetify from "./vuetify.js";
import VueNavigationBar from "vue-navigation-bar";
import langs from "./mixin/langs.js";
//Bootstrap
import "bootstrap/dist/css/bootstrap.css";

//ApexCharts
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

//EgretKit
import "vue-navigation-bar/dist/vue-navigation-bar.css";

Vue.component("vue-navigation-bar", VueNavigationBar);
Vue.mixin(mixin);
Vue.mixin(langs);
Vue.mixin(studio);
Vue.mixin(state);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount("#app");
