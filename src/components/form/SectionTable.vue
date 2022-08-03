<template>
  <div>
    <div>
      <div>
        <v-data-table
          :headers="headers"
          :items="rows"
          item-key="wording"
          mobile-breakpoint="1100"
          :items-per-page="-1"
          hide-default-footer
        >
          <template
            v-for="(col, index) in headers.slice(1)"
            v-slot:[headerTitle(col)]="{ header }"
          >
            <div :key="index" class="ml-10">
              {{ header.text }}
            </div>
          </template>
          <template
            v-for="(col, index) in headers.slice(1)"
            v-slot:[headerSlot(col)]="{ item }"
          >
            <div :key="index" class="col">
              <page-item
                v-if="isNotNull(item[col.value])"
                :item="item[col.value].item"
                :hideLabel="true"
                :reducedSV="true"
                :ref="item[col.value].item.pageItem.variableName"
                :classes="item[col.value].modifiers.classes"
                :hideStudio="true"
                @input="$emit('input', getValue(item, col, $event))"
                @change="$emit('change', getValue(item, col, $event))"
                @itemshown="$emit('itemshown', $event)"
              ></page-item>
            </div>
          </template>
          <template v-slot:[`item.wording`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ item.wording }}
                </span>
              </template>
              <v-list-item-group class="bg-white">
                <v-list-item
                  v-for="(col, index) in getColumns(item)"
                  :key="index"
                  @click="onClickLabel(col.item.pageItem.variableName)"
                >
                  {{ getColLabel(col) }}
                </v-list-item>
              </v-list-item-group>
            </v-menu>
          </template>
          <template v-slot:[`item.actions`]="{ item, index }">
            <v-menu offset-y :disabled="pendingStudioModification">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  :disabled="pendingStudioModification"
                  v-bind="attrs"
                  v-on="on"
                  color="info"
                  >mdi-pencil</v-icon
                >
              </template>
              <v-list-item-group class="bg-white">
                <v-list-item
                  v-for="(col, index) in filteredHeaders(item)"
                  :key="index"
                >
                  <edit-item-button
                    :item="
                      item[col.value]
                        ? item[col.value].item.pageItem
                        : undefined
                    "
                    :label="true"
                  ></edit-item-button>
                </v-list-item>
              </v-list-item-group>
            </v-menu>
            <v-menu offset-y :disabled="pendingStudioModification">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  :disabled="pendingStudioModification"
                  v-bind="attrs"
                  v-on="on"
                  color="info"
                  >mdi-delete</v-icon
                >
              </template>
              <v-list-item-group class="bg-white">
                <v-list-item
                  v-for="(col, index) in headers.slice(1, headers.length - 1)"
                  :key="index"
                >
                  <delete-item-button
                    :item="
                      item[col.value]
                        ? item[col.value].item.pageItem
                        : undefined
                    "
                    :label="true"
                  ></delete-item-button>
                </v-list-item>
                <v-list-item>
                  <delete-item-button
                    :item="firstItem(index)"
                    :count="rowItemCount(index)"
                    :label="true"
                    :customLabel="$t('row')"
                  ></delete-item-button>
                </v-list-item>
              </v-list-item-group>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import PageItem from "./PageItem.vue";
import { getItemWording } from "uask-dom";
import EditItemButton from "../studio/EditItemButton.vue";
import DeleteItemButton from "../studio/DeleteItemButton.vue";

export default {
  props: ["content", "currentProps"],
  components: {
    PageItem,
    EditItemButton,
    DeleteItemButton
  },
  data() {
    return {
      tableMode: 0,
      expanded: []
    };
  },
  computed: {
    headers() {
      return [
        { text: "  ", value: "wording" },
        ...this.content.columns.map(e => {
          return {
            text: this.getLabel("mlstring", {}, e, this.$i18n),
            value: this.getLabel("mlstring", {}, e, this.$i18n)
          };
        }),
        ...(this.isStudioMode ? [{ text: "Actions", value: "actions" }] : [])
      ];
    },
    rows() {
      return this.content.items.map(item => {
        return {
          wording: this.getLabel("mlstring", {}, item.wording, this.$i18n),
          ...Object.fromEntries(
            item.row.map((item, index) => [
              this.getLabel(
                "mlstring",
                {},
                this.content.columns[index],
                this.$i18n
              ),
              item
            ])
          )
        };
      });
    }
  },
  methods: {
    firstItem(rowIndex) {
      const rowWording = this.getLabel(
        "mlstring",
        {},
        this.content.items[rowIndex].wording,
        this.$i18n
      );
      return this.currentPage.items.find(i =>
        this.getLabel("mlstring", {}, i.wording, this.$i18n).startsWith(
          rowWording
        )
      );
    },
    rowItemCount(rowIndex) {
      return this.content.items[rowIndex].row.filter(r => !!r).length;
    },
    isNotNull(item) {
      return item != null;
    },
    headerSlot(slot) {
      return `item.${slot.value}`;
    },
    getValue(item, col, v) {
      return {
        item: item[col.value].item,
        ...v
      };
    },
    headerTitle(slot) {
      return `header.${slot.value}`;
    },
    getColumns(item) {
      const labels = Object.keys(item)
        .filter(key => !!item[key]?.item?.pageItem)
        .reduce((obj, key) => {
          return { ...obj, [key]: item[key] };
        }, {});
      return labels;
    },
    getColLabel(col) {
      return this.getLabel(
        "mlstring",
        {},
        getItemWording(col?.item?.pageItem),
        this.$i18n
      );
    },
    onClickLabel(variableName) {
      this.$emit("itemselected", variableName);
    },
    filteredHeaders(item) {
      return this.headers
        .slice(1, this.headers.length - 1)
        .filter(h => !!item[h.value]);
    }
  },
  i18n: {
    messages: {
      en: {
        row: "Delete row"
      },
      fr: {
        row: "Supprimer la ligne"
      }
    }
  }
};
</script>

<style>
.v-data-table-header .text-start {
  text-transform: uppercase;
  font-size: 1em !important;
}

tbody tr td:first-child {
  font-weight: bold;
  font-size: 1em !important;
}
</style>
