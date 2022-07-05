import i18n from "../../i18n.js";
import mixin from "../../mixin/index.js";

const m = mixin.methods;

const getters = {
  navSurveyOptions: function(state, getters, rootState, rootGetters) {
    const menuOptionsLeft = [
      {
        type: "link",
        text: m.getLabel(
          "mlstring",
          {},
          { en: "Dashboard", fr: "Tableau de bord" },
          i18n
        ),
        path: { name: "Dashboard" },
        iconLeft: "<i class='mdi mdi-view-dashboard'></i>"
      },
      {
        type: "link",
        text: "Participants",
        iconLeft: "<i class='mdi mdi-folder-account'></i>",
        path: { name: "Search participant" }
      },
      {
        type: "link",
        text: m.getLabel(
          "mlstring",
          {},
          { en: "Monitoring", fr: "Monitoring" },
          i18n
        ),
        iconLeft: "<i class='mdi mdi-alert'></i>",
        path: { name: "View alerts" }
      },
      {
        type: "link",
        text: m.getLabel(
          "mlstring",
          {},
          { en: "Documents", fr: "Documents" },
          i18n
        ),
        iconLeft: "<i class='mdi mdi-book'></i>",
        path: { name: "View documents" }
      }
    ];
    const menuOptionsRight = [
      {
        type: "link",
        text: m.getLabel(
          "mlstring",
          {},
          { en: "Administration", fr: "Administration" },
          i18n
        ),
        iconLeft: "<i class='mdi mdi-cogs'></i>",
        path: { name: "Admin" },
        subMenuOptions: [
          {
            type: "link",
            text: m.getLabel(
              "mlstring",
              {},
              { en: "Survey", fr: "Etude" },
              i18n
            ),
            path: { name: "Admin survey" },
            iconLeft: "<i class='mdi mdi-view-dashboard'></i>"
          },
          {
            type: "link",
            text: m.getLabel(
              "mlstring",
              {},
              { en: "Samples", fr: "Échantillons" },
              i18n
            ),
            iconLeft: "<i class='mdi mdi-home-city'></i>",
            path: { name: "Admin samples" }
          },
          {
            type: "link",
            text: m.getLabel(
              "mlstring",
              {},
              { en: "Users", fr: "Utilisateurs" },
              i18n
            ),
            iconLeft: "<i class='mdi mdi-account-check'></i>",
            path: { name: "Admin users" }
          }
        ]
      }
    ];
    const navigationOptions = {
      elementId: "mainMenu",
      isUsingVueRouter: true,
      mobileBreakpoint: 992,
      collapseButtonImageOpen: require("@/assets/menu.svg"),
      collapseButtonOpenColor: "#661c23",
      collapseButtonCloseColor: "#661c23",
      ariaLabelMainNav: "Main Navigation",
      tooltipAnimationType: "shift-away",
      menuOptionsLeft,
      menuOptionsRight: rootGetters["auth/isInRole"](
        "administrator",
        "developer",
        "superadministrator"
      )
        ? menuOptionsRight
        : undefined
    };
    return navigationOptions;
  }
};

export default {
  namespaced: true,
  getters
};
