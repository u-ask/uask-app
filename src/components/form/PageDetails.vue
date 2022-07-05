<template>
  <div>
    <v-form>
      <v-alert
        border="left"
        color="danger"
        outlined
        icon="mdi-alert"
        v-if="showWarning && state == 'pending'"
        >{{ $t("warning") }}
        <ul>
          <li v-for="(pin, i) in requiredPins" :key="i">
            {{ getLabel("mlstring", {}, pin.wording, $i18n) }}
          </li>
        </ul>
      </v-alert>
      <div>
        <div class="mb-3">
          <section-pagination
            :instance="instance"
            role="master"
            @instancechanged="instance = $event"
          ></section-pagination>
        </div>
        <div
          v-if="isStudioMode && currentSections.length == 0 && currentPage"
          class="col d-flex"
        >
          <v-divider v-if="!isHomePage"></v-divider>
          <insert-item-button
            :expanded="true"
            v-if="!isHomePage"
          ></insert-item-button>
          <v-divider v-if="!isHomePage"></v-divider>
        </div>
        <div
          v-if="
            !isStudioMode &&
              currentSections.length == 0 &&
              currentPage &&
              !isHomePage
          "
        >
          <v-alert outlined type="error">{{ $t("noItems") }}</v-alert>
        </div>
        <section-div
          v-for="(section, ix) in currentSections"
          :key="ix"
          :title="section.title"
          :visible="sectionVisible(ix)"
        >
          <section-content
            :section="section.content"
            :currentProps="getSectionProps(ix)"
            :title="section.title"
            @input="onInput($event.item, $event)"
            @change="onChange($event.item, $event)"
            @itemshown="onItemShown(ix, $event)"
            @itemselected="goToItemdetails($event)"
            @newitems="onNewItems($event)"
          >
          </section-content>
        </section-div>
      </div>
      <slot name="footer"></slot>
      <synthesis v-if="isHomePage"></synthesis>
      <div v-if="!pendingStudioModification" class="text-right">
        <action-panel
          :index="currentPageIndex"
          :indexMax="indexMax"
          :saveDisabled="state == 'pending'"
          @action="onAction($event)"
        ></action-panel>
      </div>
    </v-form>
  </div>
</template>

<script>
import {
  execute,
  status,
  parseLayout,
  getItem,
  Scope,
  Metadata,
  getTranslation
} from "uask-dom";
import { UnfoldLayout } from "uask-studio";
import SectionDiv from "./SectionDiv";
import ActionPanel from "./ActionPanel.vue";
import Synthesis from "./Synthesis.vue";
import InsertItemButton from "../studio/InsertItemButton.vue";
import SectionContent from "./SectionContent.vue";
import SectionPagination from "./SectionPagination.vue";
import sectionProps from "../../mixin/sectionProps";
import workflows from "@/mixin/workflows.js";

export default {
  data: function() {
    return {
      rules: undefined,
      items: undefined,
      newItems: [],
      instance: 1,
      participantSaving: false,
      itemSaving: false,
      needSave: false
    };
  },
  computed: {
    readwrite() {
      return (
        this.isStudioMode &&
        this.authorizationManager.canWriteItems(this.currentInterview)
      );
    },
    currentPageIndex() {
      return this.currentInterview?.pageSet.pages.indexOf(this.currentPage) !=
        -1
        ? this.currentInterview?.pageSet.pages.indexOf(this.currentPage)
        : this.currentInterview?.pageSet.pages.findIndex(
            p =>
              getTranslation(p.name, "__code__") ==
              getTranslation(this.currentPage.name, "__code__")
          );
    },
    baseLayout() {
      return parseLayout(this.items);
    },
    currentSections() {
      return this.unfoldedItem != undefined
        ? [...new UnfoldLayout(this.baseLayout, this.unfoldedItem)]
        : this.baseLayout;
    },
    values() {
      return this.items.map(i => ({
        pageItem: i.pageItem,
        context: i.context,
        value: i.value,
        unit: i.unit,
        specialValue: i.specialValue,
        messages: i.messages
      }));
    },
    indexMax() {
      if (this.currentPageSet.isMandatory(this.currentPage)) {
        const idx = this.currentInterview?.pageSet.pages.findIndex(
          p => this.currentInterview.getStatusForPage(p) == "insufficient"
        );
        if (idx > -1) return idx;
      }
      return this.currentInterview?.pageSet.pages.length - 1;
    },
    requiredPins() {
      return this.currentPage?.pins.filter(
        p => new Metadata(p, this.currentSurvey.rules).required
      );
    },
    showWarning() {
      return (
        this.currentParticipant.participantCode == "" &&
        this.requiredPins?.length > 0
      );
    },
    isInclusionPage() {
      const includedItem = this.currentSurvey.getItemForVariable(
        this.currentSurvey.options.inclusionVar.name
      );
      return this.isPageForItem(includedItem);
    },
    isContactPage() {
      const phoneItem = this.currentSurvey.getItemForVariable(
        this.currentSurvey.options.phoneVar
      );
      const emailItem = this.currentSurvey.getItemForVariable(
        this.currentSurvey.options.emailVar
      );
      return (
        this.currentParticipant.included &&
        (this.isPageForItem(phoneItem) || this.isPageForItem(emailItem))
      );
    },
    state() {
      if (this.$route.name == "Participant creation") {
        const requirePinValues = this.requiredPins?.filter(r =>
          this.values.find(
            v => v.pageItem == r && typeof v.value !== "undefined"
          )
        );
        if (
          requirePinValues?.length == 0 ||
          requirePinValues?.length < this.requiredPins?.length
        )
          return "pending";

        return "creation";
      }
      return "modification";
    }
  },
  methods: {
    loadItems() {
      this.clearSections();
      this.items = [];
      this.currentPage?.items.forEach((item, position) => {
        this.loadInstances(item, position);
      });
      this.execute();
    },
    loadInstances(item, position) {
      const proto = getItem(item);
      const all = this.currentInterview.getItemsForPrototype(proto);
      if (all.length == 0 || all[0].pageItem != proto)
        this.loadItem(item, undefined, position);
      else
        all.forEach(i => {
          this.loadItem(i.pageItem, i, position);
        });
    },
    loadItem(pageItem, item, position, x = this.items.length) {
      const it = {
        pageItem: getItem(pageItem),
        context: item?.context ?? pageItem?.context ?? 0,
        value: item?.value,
        specialValue: item?.specialValue,
        unit: item?.unit,
        messages: item?.messages ?? {},
        position
      };
      this.items.splice(x, 0, it);
      return it;
    },
    onNewItems(it) {
      this.newItems.push(...it);
      setTimeout(() => {
        if (this.newItems.length > 0) {
          this.loadNewItems(this.newItems);
          this.newItems = [];
        }
      }, 300);
    },
    loadNewItems(it) {
      it.sort((a, b) => a.position - b.position);
      let x = it[0].position;
      const items = it.map(i => {
        while (x < this.items.length && this.items[x].position <= i.position) {
          x += 1;
        }
        const res = this.loadItem(i.pageItem, undefined, i.position, x);
        x += 1;
        return res;
      });
      this.execute(items);
    },
    onInput(item, value) {
      const memento = this.setItem(item, value);
      this.$nextTick(() =>
        this.readwrite ? this.execute() : this.setItem(item, memento)
      );
    },
    onChange(item, value) {
      const memento = this.setItem(item, value);
      this.$nextTick(() =>
        this.readwrite ? this.executeAndSave() : this.setItem(item, memento)
      );
    },
    async executeAndSave() {
      this.execute();
      await this.save();
    },
    execute(initialization) {
      const scope = Scope.create(
        this.currentParticipant,
        this.currentInterview
      ).with(this.items);
      const rules = this.currentSurvey.rules;
      const executed = execute(rules, scope, { initialization }).items;
      this.items.forEach((a, i) => {
        const item = executed.find(e => e.pageItem == a.pageItem);
        this.setItem(this.items[i], item);
      });
    },
    async save() {
      const state = this.state;
      if (state == "creation") {
        await this.startSaveParticipant();
        await this.startSaveItems();
      } else if (state == "modification") {
        await this.startSaveItems();
      }
    },
    async startSaveItems() {
      if (!this.itemSaving && !this.participantSaving) {
        this.itemSaving = true;
        this.needSave = false;
        await this.pushSaveItems(this.items, async () => {
          this.itemSaving = false;
          if (this.needSave) await this.startSaveItems();
        }).catch(e => {
          this.itemSaving = false;
          console.error(e);
        });
      } else this.needSave = true;
    },
    async startSaveParticipant() {
      if (!this.participantSaving) {
        this.participantSaving = true;
        await this.pushSaveParticipant(this.currentParticipant, () => {
          this.participantSaving = false;
          this.$router.replace({
            name: "Participant Data",
            params: {
              participantCode: this.currentParticipant.participantCode
            },
            query: this.$route.query
          });
        }).catch(e => {
          this.participantSaving = false;
          console.error(e);
        });
      }
    },
    setItem(item, value) {
      const memento = { ...item };

      Object.assign(item, value);
      return memento;
    },
    isPageForItem(item) {
      return (
        !!item &&
        this.currentPageSet.getPagesForItem(item).includes(this.currentPage)
      );
    },
    async onAction({ index }) {
      this.changePage(index);
    },
    changePage(index) {
      this.setPage(this.currentInterview.pageSet.pages[index]);
    },
    status(obj) {
      return status(obj);
    },
    async goToItemdetails(event) {
      const variableName = typeof event == "string" ? event : event.name;
      this.$router.push({
        name: "Item details",
        params: {
          participantCode: this.$route.params.participantCode,
          variableName: variableName
        },
        query: {
          interview: this.$route.query.interview,
          page: this.$route.query.page,
          ...(typeof event == "string" ? {} : { instance: event.instance })
        }
      });
    },
    delaySaveItems(duration) {
      return this.delaySave(duration);
    },
    cancelSaveItems() {
      this.cancelSave(() => {
        this.loadItems();
      });
    },
    resumeSaveItems() {
      this.resumeSave();
    }
  },
  created: function() {
    this.loadItems();
  },
  watch: {
    currentPage: async function() {
      this.loadItems();
    },
    currentInterview: function(_val, _oldVal) {
      if (_val && _oldVal?.nonce > 0 && _val.nonce != _oldVal?.nonce) {
        this.loadItems();
      }
    }
  },
  mixins: [sectionProps, workflows],
  provide() {
    return {
      delaySaveItems: this.delaySaveItems,
      cancelSaveItems: this.cancelSaveItems,
      resumeSaveItems: this.resumeSaveItems
    };
  },
  i18n: {
    messages: {
      en: {
        warning:
          "Be careful, this participant won't be saved if the following questions are not filled: ",
        noItems: "This page does not contain any questions yet"
      },
      fr: {
        warning:
          "Attention, le participant ne sera pas enregistré tant que les questions suivantes ne sont pas remplies: ",
        noItems: "Cette page ne contient pas encore de questions"
      }
    }
  },
  components: {
    SectionDiv,
    ActionPanel,
    Synthesis,
    InsertItemButton,
    SectionContent,
    SectionPagination
  }
};
</script>
