<template>
  <div :class="!compact ? 'col-12' : ''">
    <div v-if="!currentPage && currentPageSet.pages.length == 0">
      <edit-page-button
        v-if="isStudioMode && !isHomePage"
        :expanded="true"
        :index="0"
        :commandType="'insert'"
      ></edit-page-button>
      <v-alert v-else type="error" outlined dense>
        {{ $t("noPage") }}
      </v-alert>
    </div>
    <v-chip-group
      id="pageMenu"
      v-if="currentPageSet.pages && !$vuetify.breakpoint.smAndDown && !compact"
      v-model="selectedPage"
      column
    >
      <span
        v-for="(page, index) in currentPageSet.pages"
        :key="index"
        class="d-flex"
      >
        <v-chip
          :disabled="isDisabled(page)"
          @click="changePage(page, index)"
          elevation="0"
          :color="isSelected(page) ? 'primary' : ''"
          text
          label
          outlined
          :id="`page-${pageCode(page)}`"
        >
          <lang-label :labels="pageName(page)"></lang-label>
          <status-icon :status="pageStatus(page)" small></status-icon>
          <div class="d-flex" v-if="isStudioMode && !isHomePage">
            <edit-page-button :index="index" small></edit-page-button>
            <delete-page-button
              :index="index"
              class="ml-1"
            ></delete-page-button>
          </div>
        </v-chip>
        <edit-page-button
          v-if="isStudioMode && isLastPageIndex(index) && !isHomePage"
          :index="index + 1"
          :commandType="'insert'"
        ></edit-page-button>
      </span>
    </v-chip-group>

    <v-menu
      offset-y
      v-if="
        ((currentPageSet.pages && $vuetify.breakpoint.smAndDown) || compact) &&
          currentPageSet.pages.length > 0
      "
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn id="pageMenu" class="col" v-bind="attrs" v-on="on" text outlined>
          <lang-label :labels="pageName(currentPage)"></lang-label>
          <status-icon :status="pageStatus(currentPage)" small></status-icon>
          <v-spacer></v-spacer>
          <v-icon class="ml-2">mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-item-group id="pagegroup" v-model="selectedPage">
        <span
          v-for="(page, index) in currentPageSet.pages"
          :key="index"
          class="d-flex"
        >
          <v-list-item
            name="page"
            :value="index"
            :disabled="isDisabled(page)"
            @click="changePage(page, index)"
            :data-active="page == currentPage"
            elevation="0"
            class="bg-white"
            focusable
            :id="`page-${pageCode(page)}`"
          >
            <v-list-item-title>
              <lang-label :labels="page.name"></lang-label>
              <status-icon :status="pageStatus(page)" small></status-icon>
              <div class="d-flex" v-if="isStudioMode">
                <edit-page-button :index="index"></edit-page-button>
                <delete-page-button
                  :index="index"
                  class="ml-1"
                ></delete-page-button>
              </div>
            </v-list-item-title>
          </v-list-item>
          <edit-page-button
            v-if="isStudioMode && isLastPageIndex(index)"
            :index="index + 1"
            :commandType="'insert'"
          ></edit-page-button>
        </span>
      </v-item-group>
    </v-menu>
  </div>
</template>

<script>
import LangLabel from "../input/LangLabel";
import DeletePageButton from "../studio/DeletePageButton.vue";
import EditPageButton from "../studio/EditPageButton.vue";
import StatusIcon from "./StatusIcon.vue";
import { getTranslation } from "uask-dom";
import workflows from "@/mixin/workflows.js";

export default {
  props: ["compact"],
  data() {
    return {
      selectedPage: undefined,
      currentQuery: {}
    };
  },
  computed: {
    queryString() {
      const ix = this.currentParticipant.interviews.findIndex(
        e =>
          e.pageSet == this.currentPageSet &&
          e.nonce == this.currentInterview?.nonce
      );
      if (ix == -1) return {};
      const px = this.currentParticipant.interviews[ix].pageSet.pages.indexOf(
        this.currentPage
      );
      return {
        interview: ix + 1,
        page: px + 1
      };
    },
    params() {
      return this.routeName == "Participant Data"
        ? { participantCode: this.currentParticipant.participantCode }
        : {};
    },
    routeName() {
      return this.currentParticipant.participantCode
        ? "Participant Data"
        : "Participant creation";
    }
  },
  methods: {
    pageCode(page) {
      return getTranslation(page.name, "__code__");
    },
    changePage(page) {
      this.setPage(page);
      this.selectedPage = this.currentPageSet.pages.findIndex(
        p => p == this.currentPage
      );
    },
    pageName: function(page) {
      return page?.name ?? "";
    },
    pageStatus: function(page) {
      return this.currentInterview?.getStatusForPage(page) ?? "incomplete";
    },
    updateQueryString() {
      const interviewQuery = Object.fromEntries(
        Object.entries(this.queryString).filter(criterion => criterion[1])
      );
      if (this.queryChanged(interviewQuery)) {
        this.currentQuery = interviewQuery;
        this.$router
          .push({
            name: this.routeName,
            query: this.currentQuery,
            params: this.params
          })
          .catch(() => {});
      }
    },
    queryChanged(query) {
      return (
        (query.interview &&
          query.interview !=
            (this.currentQuery.interview ?? this.$route.query.interview)) ||
        query.page != (this.currentQuery.page ?? this.$route.query.page)
      );
    },
    isDisabled(page) {
      if (this.isStudioMode && !this.pendingStudioModification) return false;
      if (this.pendingStudioModification) return true;
      return this.currentInterview?.status == "insufficient"
        ? this.currentPageSet.isMandatory(page)
          ? this.isLastMandatoryPageSufficient(page)
          : true
        : false;
    },
    isLastMandatoryPageSufficient(page) {
      const index = this.currentPageSet.mandatoryPages.findIndex(
        p => p.name == page.name
      );
      return index == 0
        ? false
        : this.currentInterview?.getStatusForPage(
            this.currentPageSet.mandatoryPages[index - 1]
          ) == "insufficient";
    },
    isSelected(page) {
      return this.currentPage?.name == page?.name;
    },
    isLastPageIndex(index) {
      return this.currentPageSet.pages.length - 1 == index;
    }
  },
  mounted: function() {
    this.updateQueryString();
  },
  updated: function() {
    this.updateQueryString();
  },
  mixins: [workflows],
  i18n: {
    messages: {
      en: {
        noPage: "This interview does not contain any pages"
      },
      fr: {
        noPage: "Cette interview ne contient aucune page"
      }
    }
  },
  components: {
    LangLabel,
    StatusIcon,
    EditPageButton,
    DeletePageButton
  }
};
</script>
