<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    :custom-filter="filterOnDateString"
    hide-default-footer
    disable-pagination
  >
    <template v-slot:top>
      <v-row>
        <v-col cols="12" sm="8">
          <slot name="title"></slot>
        </v-col>
        <v-col v-if="searchable" cols="12" sm="4">
          <v-text-field
            v-model="search"
            :label="$t('search')"
            prepend-icon="mdi-magnify"
            class="mx-4"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </template>
    <template v-slot:[`header.incomplete`]="{ header }">
      <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>
      {{ header.text }}
    </template>
    <template v-slot:[`header.empty`]="{ header }">
      <v-icon class="mr-2">mdi-close-circle</v-icon>
      {{ header.text }}
    </template>
    <template v-if="canDelete" v-slot:[`item.delete`]="{ item }">
      <delete-manager
        :interview="item.delete"
        compact
        @delete="onDelete($event)"
      ></delete-manager>
    </template>
    <template v-slot:[`item.date`]="{ item }">
      <v-chip
        :id="item.id"
        outlined
        label
        @click="navigateToInterview(item.date.interview)"
      >
        {{ item.date.label }}
      </v-chip>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <status-icon :status="item.status"></status-icon>
    </template>
    <template v-slot:[`item.incomplete`]="{ item }">
      <v-expansion-panels flat hover>
        <v-expansion-panel>
          <v-expansion-panel-header elevation="0">
            {{ item.incomplete.length }} module(s)
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item-group>
              <v-list-item
                v-for="(i, index) in item.incomplete"
                :key="index"
                @click="navigateToPage(i.interview, i.page)"
                >{{ i.label }}</v-list-item
              >
            </v-list-item-group>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-slot:[`item.empty`]="{ item }">
      <v-expansion-panels flat hover>
        <v-expansion-panel>
          <v-expansion-panel-header elevation="0">
            {{ item.empty.length }} module(s)
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item-group>
              <v-list-item
                v-for="(i, index) in item.empty"
                :key="index"
                @click="navigateToPage(i.interview, i.page)"
                >{{ i.label }}</v-list-item
              >
            </v-list-item-group>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-data-table>
</template>

<script>
import StatusIcon from "./StatusIcon.vue";
import DeleteManager from "../participant/DeleteManager.vue";

export default {
  props: ["interviews", "singlePage"],
  data() {
    return {
      search: ""
    };
  },
  computed: {
    canDelete() {
      return !this.isStudioMode && this.authorizationManager.canDelete();
    },
    headers() {
      return [
        ...(this.canDelete
          ? [
              {
                text: this.$t("delete"),
                value: "delete",
                width: "3rem",
                sortable: false,
                align: "center"
              }
            ]
          : []),
        {
          text: "Date",
          value: "date",
          sort: this.sortOnDate,
          width: "15rem",
          align: "left"
        },
        { text: "Status", value: "status", align: "center", width: "6rem" },
        {
          text: this.$t("incomplete"),
          value: "incomplete",
          align: this.singlePage ? " d-none " : "center",
          sort: this.sortOnNbrPages
        },
        {
          text: this.$t("empty"),
          value: "empty",
          align: this.singlePage ? " d-none " : "center",
          sort: this.sortOnNbrPages
        },
        {
          align: this.singlePage ? "center" : " d-none "
        }
      ];
    },
    items() {
      return this.interviews.map((i, x) => {
        const { incomplete, empty } = this.incompletePages(i);
        const date = i?.date ?? i?.signatureDate ?? i?.inputDate;
        return {
          ...(this.canDelete
            ? { delete: this.currentParticipant.interviews.indexOf(i) }
            : {}),
          id:
            "idate-" +
            this.getLabel("mlstring", {}, i.pageSet.type, {
              ...this.$i18n,
              locale: "__code__"
            }) +
            String(x),
          date: {
            label: date
              ? this.getLabel("date", {}, date, this.$i18n)
              : this.$t("noDate"),
            interview: this.currentParticipant.interviews.indexOf(i) + 1
          },
          status: this.status(i),
          incomplete: incomplete,
          empty: empty
        };
      });
    },
    searchable() {
      if (this.interviews.length > 1) return true;
      if (this.interviews.length == 0) return false;
      return this.currentWorkflow.many.includes(this.interviews[0].pageSet);
    }
  },
  methods: {
    incompletePages(interview) {
      return interview.pageSet.pages.reduce(
        (result, page) => {
          const selectedPage = {
            label: this.getLabel("mlstring", {}, page.name, this.$i18n),
            interview: this.currentParticipant.interviews.indexOf(interview) + 1,
            page: interview.pageSet.pages.indexOf(page) + 1
          };
          if (interview.getStatusForPage(page) == "empty")
            result.empty.push(selectedPage);
          if (interview.getStatusForPage(page) == "incomplete")
            result.incomplete.push(selectedPage);

          return result;
        },
        { incomplete: [], empty: [] }
      );
    },
    navigateToPage(interview, page) {
      this.$router.push({
        query: {
          interview: interview,
          page: page
        }
      });
    },
    navigateToInterview(interview) {
      this.$router.push({
        query: {
          interview: interview
        }
      });
    },
    status(interview) {
      return (
        this.currentParticipant.interviews?.find(
          i => i.pageSet == interview?.pageSet && i.nonce == interview.nonce
        )?.status ?? "incomplete"
      );
    },
    filterOnDateString(value, search) {
      return value != null && search != null && value.label?.includes(search);
    },
    sortOnDate(a, b) {
      return new Date(a.label) - new Date(b.label);
    },
    sortOnNbrPages(a, b) {
      return a.length - b.length;
    },
    onDelete(ev) {
      this.$emit("delete", ev);
    }
  },
  components: { StatusIcon, DeleteManager },
  i18n: {
    messages: {
      en: {
        noDate: "Not dated yet",
        incomplete: "Partially completed",
        empty: "Not filled",
        search: "Search",
        delete: "Del."
      },
      fr: {
        noDate: "Pas encore daté",
        incomplete: "Partiellement remplies",
        empty: "Non remplies",
        search: "Recherche",
        delete: "Suppr."
      }
    }
  }
};
</script>

<style>
.v-data-table-header th {
  text-align: center;
}
</style>
