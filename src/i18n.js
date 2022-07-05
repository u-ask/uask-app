import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

const messages = {
  en: {
    domain: {
      noParticipant: "Participant #",
      noSample: "Sample #",
      pageSet: "Interview",
      survey: "Survey"
    },
    sentence: { enter: "Enter {what}" },
    action: {
      openData: "Data",
      edit: "Edit",
      create: "Create",
      continue: "Continue",
      previous: "Previous",
      save: "Save",
      cancel: "Cancel"
    },
    events: {
      loading: "Loading, please wait..."
    },
    roles: {
      developer: "Developer",
      administrator: "Administrator",
      writer: "Writer",
      reader: "Reader",
      superadministrator: "Super Administrator"
    },
    studio: {
      studioMode: "STUDIO MODE"
    },
    track: {
      newIssue: "Make a request"
    }
  },
  fr: {
    domain: {
      noParticipant: "N° participant",
      noSample: "N° échantillon",
      pageSet: "Interview",
      survey: "Etude"
    },
    sentence: { enter: "Saisir {what}" },
    action: {
      openData: "Données",
      edit: "Modifier",
      create: "Enregistrer",
      continue: "Continuer",
      previous: "Précédent",
      save: "Enregistrer",
      cancel: "Annuler"
    },
    events: {
      loading: "Chargement en cours, participantez svp..."
    },
    roles: {
      developer: "Développeur",
      administrator: "Administrateur",
      writer: "Écrivain",
      reader: "Lecteur",
      superadministrator: "Super Administrateur"
    },
    studio: {
      studioMode: "MODE STUDIO"
    },
    track: {
      newIssue: "Faire une demande"
    }
  }
};
const loc = new Intl.Locale(navigator.language);

export default new VueI18n({
  locale: loc.language,
  messages: messages,
  silentTranslationWarn: true
});
