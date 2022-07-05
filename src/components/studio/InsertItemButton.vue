<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        outlined
        class="bg-gray-100"
        color="info"
        :icon="!expanded"
        :disabled="disabled"
        :id="`insert-item-${index}`"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon v-if="!expanded">mdi-plus</v-icon>
        <span v-else>{{ $t("addItem") }}</span>
      </v-btn>
    </template>
    <v-list-item-group id="insert-choices" class="bg-white">
      <v-list-item
        :id="`insert-single-${index}`"
        @click="startItemInsertion()"
        >{{ $t("addBasicItem") }}</v-list-item
      >
      <v-list-item
        :id="`insert-table-${index}`"
        @click="startTableLineInsertion()"
        >{{ $t("addTableLine") }}</v-list-item
      >
    </v-list-item-group>
  </v-menu>
</template>

<script>
import studioState from "../../mixin/studioState";
import { InsertItemCommand, InsertTableLineCommand } from "uask-studio";
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    expanded: {
      type: Boolean,
      default: false
    },
    section: {},
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async startItemInsertion() {
      this.start(this.itemCommand);
    },
    async startTableLineInsertion() {
      this.start(this.tableLineCommand);
    },
    itemCommand(state) {
      return state.start(
        InsertItemCommand,
        this.pageIndex,
        this.index,
        this.section
      );
    },
    tableLineCommand(state) {
      return state.start(
        InsertTableLineCommand,
        this.pageIndex,
        this.index,
        this.section
      );
    }
  },
  mixins: [studioState],
  i18n: {
    messages: {
      en: {
        addItem: "Add a new question",
        addBasicItem: "Question",
        addTableLine: "Table Line"
      },
      fr: {
        addItem: "Ajouter une nouvelle question",
        addBasicItem: "Question",
        addTableLine: "Ligne de tableau"
      }
    }
  }
};
</script>
