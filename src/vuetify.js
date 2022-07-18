import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { themePreset } from "./themeConfig.js";

Vue.use(Vuetify);

const opts = {
  theme: themePreset.theme,
  rtl: themePreset.rtl
};

export default new Vuetify(opts);
