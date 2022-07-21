<template>
  <div>
    <span v-for="(content, index) in section" :key="index">
      <div>
        <section-table
          v-if="content.behavior == 'table'"
          :content="content"
          :currentProps="currentProps"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          @itemshown="$emit('itemshown', $event)"
          @itemselected="$emit('itemselected', $event)"
        ></section-table>
        <section-recordset
          v-else-if="content.behavior == 'recordset'"
          :content="content"
          :sectionProps="getSectionProps(index)"
          v-show="sectionVisible(index)"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          @itemshown="
            onItemShown(index, $event);
            $emit('itemshown', $event);
          "
          @itemselected="$emit('itemselected', $event)"
          @newitems="$emit('newitems', $event)"
        >
        </section-recordset>
        <page-item
          v-else
          class="my-0"
          :layout="content.behavior"
          :modifiers="content.labels"
          :classes="content.modifiers.classes"
          :item="content.item"
          :sectionProps="currentProps"
          @input="$emit('input', { ...$event, item: content.item })"
          @change="$emit('change', { ...$event, item: content.item })"
          @itemshown="$emit('itemshown', $event)"
          @itemselected="$emit('itemselected', $event)"
        >
        </page-item>
      </div>
    </span>
    <div v-if="plusButton" class="col text-right my-1 py-0">
      <insert-item-button
        :index="getLastItemIndexInPage + 1"
        :section="title"
        class="mx-auto col"
      ></insert-item-button>
    </div>
  </div>
</template>

<script>
import PageItem from "./PageItem.vue";
import SectionRecordset from "./SectionRecordset.vue";
import SectionTable from "./SectionTable.vue";
import sectionProps from "../../mixin/sectionProps";
import InsertItemButton from "../studio/InsertItemButton.vue";
import { getItem } from "uask-dom";

export default {
  name: "SectionContent",
  props: ["currentProps", "section", "title", "noPlusButton"],
  mixins: [sectionProps],
  computed: {
    getLastItemIndexInPage() {
      const lastItem = this.lastItem(this.section[this.section.length - 1]);
      return lastItem
        ? this.currentPage.items.findIndex(i => getItem(i) == getItem(lastItem))
        : 0;
    },
    plusButton() {
      return (
        this.isStudioMode &&
        typeof this.noPlusButton == "undefined" &&
        !this.pendingStudioModification
      );
    }
  },
  methods: {
    lastItem(content) {
      switch (content.behavior) {
        case "item" || "richItem":
          return content.item;
        case "table": {
          const lastRow = content.items[content.items.length - 1];
          return lastRow.row[lastRow.row.length - 1].item;
        }
        case "recordset": {
          const longestRow = content.items.reduce(
            (row, it) => (it.length > row.length ? it : row),
            []
          );
          return this.lastItem(longestRow[longestRow.length - 1]);
        }
        case "default":
          return undefined;
      }
    }
  },
  watch: {
    currentProps(val) {
      if (val?.itemCount == 0) this.clearSections();
    }
  },
  components: {
    PageItem,
    SectionRecordset,
    SectionTable,
    InsertItemButton
  }
};
</script>
