<template>
  <div>
    <template v-if="isInsertCommand">
      <v-btn
        v-if="!pendingStudioModification"
        :icon="!expanded"
        color="primary"
        class="mr-2 bg-gray-100"
        outlined
        small
        @click="startModification()"
        :id="`insert-page-${index}`"
      >
        <v-icon v-if="!expanded">mdi-plus</v-icon>
        <span v-else>{{ $t("addPage") }}</span>
      </v-btn>
    </template>
    <template v-else>
      <v-btn
        icon
        color="info"
        class="ml-1"
        small
        @click="startModification()"
        :id="`edit-page-${pageCode}`"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
import { UpdatePageCommand, InsertPageCommand } from "uask-studio";
import { getTranslation } from "uask-dom";
import studioState from "../../mixin/studioState";

export default {
  props: {
    index: {
      type: Number
    },
    commandType: {
      type: String,
      default: "update",
      required: false
    },
    expanded: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isInsertCommand() {
      return this.commandType == "insert";
    },
    pageCode() {
      return getTranslation(
        this.currentPageSet.pages[this.index].name,
        "__code__"
      );
    }
  },
  methods: {
    async startModification() {
      this.start(this.command);
    },
    async command(state) {
      if (this.isInsertCommand)
        return state.start(InsertPageCommand, this.pageSetIndex, this.index);
      else
        return state.start(
          UpdatePageCommand,
          this.indexInSurveyPages(this.index)
        );
    },
    indexInSurveyPages(index) {
      return this.currentSurvey.pages.indexOf(this.currentPageSet.pages[index]);
    }
  },
  mixins: [studioState],
  i18n: {
    messages: {
      en: {
        addPage: "Add a new page"
      },
      fr: {
        addPage: "Ajouter une nouvelle page"
      }
    }
  }
};
</script>
