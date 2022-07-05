<template>
  <div>
    <v-card-text>
      <div id="title" class="px-5 py-3 border rounded">
        <h5>{{ $t("title") }}</h5>
        <single-choice-input
          :value="title"
          :type="allTitles"
          @change="updateTitle($event)"
          :compact="true"
          :clearable="true"
          :label="isUserProfile ? undefined : 'Ex: Dr.'"
        ></single-choice-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="firstName" class="px-5 py-3 border rounded">
        <h5>{{ $t("firstName") }}</h5>
        <text-input
          v-model="firstName"
          :label="isUserProfile ? undefined : 'Ex: John'"
        ></text-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="name" class="px-5 py-3 border rounded">
        <h5>{{ $t("name") }}</h5>
        <text-input
          v-model="name"
          :label="isUserProfile ? undefined : 'Ex: Doe'"
        ></text-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="userPhone" class="px-5 py-3 border rounded">
        <h5>{{ $t("phone") }}</h5>
        <text-input
          v-model="phone"
          :label="isUserProfile ? undefined : 'Ex: 0618752424'"
        ></text-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="userEmail" class="px-5 py-3 border rounded">
        <h5>{{ $t("email") }}</h5>
        <text-input
          v-model="email"
          type="email"
          :label="isUserProfile ? undefined : 'Ex: john.doe@testify.com'"
        ></text-input>
      </div>
    </v-card-text>
    <v-card-text>
      <div id="userRole" class="px-5 py-3 border rounded">
        <h5>{{ $t("role") }}</h5>
        <single-choice-input
          :value="workflow"
          :type="allWorkflows"
          :disabled="isUserProfile"
          @change="updateRole($event)"
          :compact="true"
        ></single-choice-input>
      </div>
    </v-card-text>
    <v-card-text v-if="!this.allCenters">
      <div id="userSamples" class="px-5 py-3 border rounded">
        <h5>{{ $t("samples") }}</h5>
        <multiple-choice-input
          :compact="true"
          :type="allSamples"
          :readonly="readonly"
          :value="samples"
          @change="samples = $event"
          :chipsColor="'success'"
        ></multiple-choice-input>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <div v-if="actions" class="my-3 text-right">
      <action-panel
        @action="onAction($event.type)"
        :saveDisabled="!isEmailValid(email)"
      ></action-panel>
    </div>
  </div>
</template>

<script>
import ActionPanel from "./ActionPanelAdmin.vue";
import MultipleChoiceInput from "../input/MultipleChoiceInput.vue";
import SingleChoiceInput from "../input/SingleChoiceInput.vue";
import TextInput from "../input/TextInput";
import { User, Sample, DomainCollection } from "uask-dom";
import workflows from "@/mixin/workflows.js";

export default {
  props: ["user", "actions"],
  data() {
    return {
      allSamples: [],
      allTitles: ["Dr.", "Pr.", "Mr.", "Mrs.", "Miss."],
      firstName: undefined,
      name: undefined,
      title: undefined,
      phone: undefined,
      email: undefined,
      email_verified: undefined,
      workflow: undefined,
      userid: undefined,
      id: undefined,
      samples: []
    };
  },
  computed: {
    userSamples() {
      return this.user.samples.map(e => e.sampleCode);
    },
    isUserProfile() {
      return this.$route.name == "User profile";
    },
    role() {
      return this.workflow?.split(":")?.[0];
    },
    readonly() {
      return this.authorizationManager.canSaveUser();
    },
    allCenters() {
      return (
        this.workflow == undefined ||
        ["administrator", "developer", "superadministrator"].includes(this.role)
      );
    }
  },
  methods: {
    async onAction(event) {
      switch (event) {
        case "save": {
          const samples = await this.drivers.sampleDriver.getAll(
            this.currentSurvey
          );
          const newUser = new User(
            this.name,
            this.firstName,
            this.title,
            this.workflow,
            this.email,
            this.phone,
            this.allCenters
              ? [new Sample("__all__")]
              : this.samples.map(sampleCode =>
                  samples.find(s => s.sampleCode == sampleCode)
                ),
            DomainCollection(),
            {
              id: this.id,
              userid: this.userid ?? this.email,
              email_verified: this.email_verified
            }
          );
          this.$emit("save", newUser);
          break;
        }
        case "cancel":
          this.$emit("cancel");
          break;
      }
    },
    async setUser(user) {
      this.firstName = user?.firstName;
      this.name = user?.name;
      this.title = user?.title;
      this.phone = user?.phone;
      this.email = user?.email;
      this.workflow = user?.workflow;
      this.userid = user?.userid;
      this.id = user?.id;
      this.email_verified = user?.email_verified;
      this.samples = this.userSamples;
    },
    updateRole(workflow) {
      this.workflow = workflow;
    },
    updateTitle(title) {
      this.title = title;
    },
    isEmailValid(value) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value);
    }
  },
  async mounted() {
    this.allSamples = await this.drivers.sampleDriver
      .getAll(this.currentSurvey)
      .then(e => e.map(ee => ee.sampleCode));
    if (this.isUserProfile) await this.setUser(this.user);
  },
  mixins: [workflows],
  components: {
    MultipleChoiceInput,
    TextInput,
    ActionPanel,
    SingleChoiceInput
  },
  i18n: {
    messages: {
      en: {
        administrator: "Administrator",
        associate: "Associate",
        investigator: "Investigator",
        participant: "Participant",
        phone: "Phone number",
        email: "Email adress",
        samples: "Available samples",
        firstName: "First name",
        name: "Last name",
        title: "Title",
        role: "Role"
      },
      fr: {
        administrator: "Administrateur",
        associate: "ARC",
        investigator: "Investigateur",
        participant: "Participant",
        phone: "N° de téléphone",
        email: "Adresse email",
        samples: "Échantillon(s) attribué(s)",
        firstName: "Prénom",
        name: "Nom",
        title: "Titre",
        role: "Role"
      }
    }
  }
};
</script>
