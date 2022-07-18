import { mapGetters } from "vuex";

const allLangs = [
  {
    value: "en",
    text: "English",
    flag: require("@/assets/us.svg")
  },
  {
    value: "fr",
    text: "Français",
    flag: require("@/assets/fr.svg")
  }
];

export default {
  computed: {
    ...mapGetters(["currentSurvey"]),
    langs() {
      return this.currentSurvey
        ? this.currentSurvey?.options.languages.map(
            l => allLangs.find(al => al.value == l) ?? { value: l, text: l }
          )
        : allLangs;
    },
    multiLangClass() {
      return this.classes?.includes("multiLang");
    }
  }
};
