<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      mobile-breakpoint="800"
      class="my-5 mx-3"
      :search="search"
    >
      <template v-slot:top="{}">
        <div
          class="align-baseline col justify-space-between pb-0"
          :class="{ 'd-flex': !mobile, 'px-0': mobile }"
        >
          <h5 class="ml-2">{{ $t("usersList") }}</h5>
          <v-spacer></v-spacer>
          <v-text-field
            outlined
            id="user-search"
            v-model="search"
            :label="$t('userSearch')"
            class="mw-50"
            clearable
          ></v-text-field>
        </div>
        <v-divider></v-divider>
      </template>
      <template v-slot:[`item.workflow`]="{ item }">
        <single-choice-input
          :value="item.workflow"
          @change="item.workflow = $event"
          :type="allWorkflows"
          :compact="true"
        >
        </single-choice-input>
      </template>
      <template v-slot:[`item.samples`]="{ item }">
        <multiple-choice-input
          v-if="!allCenters(item.role)"
          :value="item.samples"
          @change="item.samples = $event"
          :type="sampleCodes"
          :compact="true"
          :chipsColor="'success'"
        >
        </multiple-choice-input>
        <v-chip v-else color="primary">{{ $t("allSamples") }}</v-chip>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <div class="my-3 text-right">
      <action-panel
        :saveDisabled="!stale"
        @action="onAction($event)"
      ></action-panel>
    </div>
  </div>
</template>

<script>
import MultipleChoiceInput from "../input/MultipleChoiceInput.vue";
import SingleChoiceInput from "../input/SingleChoiceInput.vue";
import ActionPanel from "../admin/ActionPanelAdmin.vue";
import { mapGetters } from "vuex";
import workflows from "@/mixin/workflows.js";

export default {
  data() {
    return {
      users: [],
      items: [],
      updatedUsers: [],
      search: "",
      sampleCodes: [],
      samples: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Firstname", value: "firstName" },
        { text: "Title", value: "title" },
        { text: "Email", value: "email" },
        { text: "Phone number", value: "phone" },
        { text: "Role", value: "workflow" },
        { text: "Available Samples", value: "samples" }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["email"]),
    stale() {
      return this.users.some((u, x) => {
        if (this.items.length <= x) return true;
        // eslint-disable-next-line no-unused-vars
        const { samples, ...others } = this.items[x];
        if (u.update({ ...others }) != u) return true;
        if (u.sampleCodes.length != samples.length) return true;
        return u.sampleCodes.some(s => !samples.includes(s));
      });
    }
  },
  methods: {
    allCenters(role) {
      return ["administrator", "developer", "superadministrator"].includes(
        role
      );
    },
    async loadUsers() {
      this.samples = await this.drivers.sampleDriver.getAll(this.currentSurvey);
      this.sampleCodes = this.samples.map(s => s.sampleCode);
      this.users = (
        await this.drivers.userDriver.getAll(this.currentSurvey)
      ).sort((a, b) => a.userid.localeCompare(b.userid));
      this.items = this.users.map(u => {
        return {
          name: u.name,
          firstName: u.firstName,
          title: u.title,
          email: u.email,
          phone: u.phone,
          workflow: u.workflow,
          role: u.role,
          samples: u.sampleCodes,
          userid: u.userid
        };
      });
    },
    async saveUsers() {
      await Promise.all(
        this.users.map(async (u, i) => {
          const j = this.items.findIndex(user => u.userid == user.userid);
          if (j != -1) {
            const update = {
              workflow: this.items[j]?.workflow,
              sampleCodes: this.items[j]?.samples
            };
            const updated = u.update(update);
            await this.drivers.userDriver.save(this.currentSurvey, updated);
            this.users[i] = updated;
          }
        })
      );
      await this.loadUsers();
    },
    async onAction({ type }) {
      switch (type) {
        case "cancel":
          await this.loadUsers();
          break;
        case "save":
          await this.saveUsers();
          break;
      }
    }
  },
  async mounted() {
    await this.loadUsers();
  },
  mixins: [workflows],
  inject: ["needSave"],
  watch: {
    stale(value) {
      this.needSave(value);
    }
  },
  i18n: {
    messages: {
      en: {
        createUser: "New User",
        save: "Save",
        allSamples: "All Samples",
        usersList: "Users list",
        userSearch: "Users search"
      },
      fr: {
        createUser: "Nouvel Utilisateur",
        save: "Enregistrer",
        allSamples: "Tous les échantillons",
        usersList: "Liste des utilisateurs",
        userSearch: "Recherche utilisateur"
      }
    }
  },
  components: {
    SingleChoiceInput,
    MultipleChoiceInput,
    ActionPanel
  }
};
</script>
