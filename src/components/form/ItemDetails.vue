<template>
  <div v-if="item.pageItem">
    <div class="d-flex justify-start align-center m-1">
      <v-chip class="mx-1" outlined label>
        <page-set-label :interview="currentInterview"></page-set-label>
      </v-chip>
      <v-chip outlined label>
        <strong class="mr-2">Page : </strong>
        <em class="mr-1">
          <lang-label :labels="currentPage.name"></lang-label>
        </em>
        <status-icon :status="pageStatus(currentPage)" small></status-icon>
      </v-chip>
      <v-chip label outlined class="ml-1"
        ><em>Variable</em> : <lang-label :labels="variableName"></lang-label
      ></v-chip>
      <v-chip v-if="isRecordSet" label outlined class="ml-1">{{
        `Instance : ${item.pageItem.instance}`
      }}</v-chip>
    </div>
    <information-banner></information-banner>
    <base-card class="my-3 p-1 px-10">
      <page-item
        class="my-5"
        :item="item"
        @input="onInput($event)"
        @change="onChange($event)"
        :layout="itemContent.behavior"
        :classes="classes"
        :modifiers="itemContent.labels"
      ></page-item>
    </base-card>
    <audit-trail
      :pageItem="item.pageItem"
      :recordset="isRecordSet"
    ></audit-trail>
    <v-btn id="back" class="mt-6" color="primary" @click="backData()">
      {{ $t("back") }}
    </v-btn>
  </div>
</template>

<script>
import InformationBanner from "../participant/InformationBanner";
import PageSetLabel from "./PageSetLabel.vue";
import LangLabel from "../input/LangLabel";
import PageItem from "./PageItem.vue";
import StatusIcon from "./StatusIcon.vue";
import AuditTrail from "./AuditTrail.vue";
import {
  getItem,
  parseLayout,
  execute,
  Scope,
  PageItem as Prototype,
  InterviewItem
} from "uask-dom";

export default {
  name: "ItemDetails",
  data: function() {
    return {
      item: {}
    };
  },
  computed: {
    readwrite() {
      return this.authorizationManager.canWriteItems(this.currentInterview);
    },
    items() {
      return [this.item];
    },
    layout() {
      return parseLayout(this.items)[0].content[0];
    },
    isRecordSet() {
      return this.layout?.behavior == "recordset";
    },
    itemContent() {
      const content = this.layout;
      return content.behavior == "recordset"
        ? content.items[this.instance - 1][0]
        : content;
    },
    variableName() {
      return this.$route.params.variableName;
    },
    instance() {
      return parseInt(this.$route.query.instance) || 1;
    },
    hash() {
      const pageItem = this.item.pageItem;
      return `#${pageItem.variableName}${
        pageItem.array ? `&instance=${pageItem.instance}` : ""
      }`;
    },
    classes() {
      return this.itemContent?.modifiers?.classes;
    }
  },
  methods: {
    pageStatus: function(page) {
      return this.currentInterview?.getStatusForPage(page) ?? "incomplete";
    },
    setItem(value) {
      const memento = this.item;
      this.item = value;
      return memento;
    },
    initItem() {
      const prototype = this.currentInterview.pageSet.items
        .map(getItem)
        .find(pi => pi.variableName == this.variableName);
      const pageItem = Prototype.getInstance(prototype, this.instance);
      const interviewItem = this.currentInterview.getItemForVariable(
        this.variableName,
        parseInt(this.$route.query.instance) || 1
      );
      this.setItem(interviewItem ?? new InterviewItem(pageItem, undefined));
    },
    onInput(value) {
      const memento = this.setItem(value);
      this.$nextTick(
        this.readwrite ? this.execute : () => this.setItem(memento)
      );
    },
    async onChange(value) {
      const memento = this.setItem(value);
      if (this.readwrite) {
        this.execute();
        await this.pushSaveItems(this.items);
        this.initItem();
      } else {
        this.$nextTick(() => this.setItem(memento));
      }
    },
    execute() {
      const scope = Scope.create(
        this.currentParticipant,
        this.currentInterview
      );
      const rules = this.currentSurvey.rules;
      const executed = execute(rules, scope.with(this.items)).items;
      this.setItem(this.item, executed[0]);
    },
    backData() {
      this.$router.push({
        name: "Participant Data",
        params: { participantCode: this.currentParticipant.participantCode },
        query: {
          interview: this.$route.query.interview,
          page: this.$route.query.page
        },
        hash: this.hash
      });
    }
  },
  mounted() {
    this.initItem();
  },
  watch: {
    currentInterview() {
      this.initItem();
    }
  },
  i18n: {
    messages: {
      en: {
        back: "Back to the Data"
      },
      fr: {
        back: "Retour au Data"
      }
    }
  },
  components: {
    InformationBanner,
    PageSetLabel,
    LangLabel,
    PageItem,
    StatusIcon,
    AuditTrail
  }
};
</script>
