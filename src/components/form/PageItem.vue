<template>
  <div
    :class="[
      classes,
      isStudioItemTarget ? 'studio studioItemTarget' : '',
      isStudioApply ? 'mb-3' : '',
      mobile ? 'my-3' : '',
      isStudioItem ||
      isStudioApply ||
      !isStudioMode ||
      (!visible && !showInvisibleItems)
        ? ''
        : 'border-bottom',
      !visible && showInvisibleItems ? 'bg-light' : ''
    ]"
    class="position-relative"
  >
    <template v-if="visible || showInvisibleItems">
      <v-chip
        v-if="isStudioMode && !isStudioElement"
        :class="['ml-1 mt-2', isInfo ? 'mb-n10' : '']"
        label
        outlined
        :color="isStudioItemTarget ? 'white' : 'secondary'"
        small
        class="position-absolute mx-auto stamp"
      >
        {{ pageItem.variableName }}
      </v-chip>
      <transition name="fade" mode="out-in">
        <info-label
          v-if="isInfo"
          :id="pageItem.variableName"
          :labels="itemWording"
          :classes="classes"
          :pageItem="pageItem"
          :class="{ 'pt-10 px-0': !mobile }"
        >
          <template v-slot:pre-wording>
            <div
              v-if="isStudioMode && !isStudioElement && !isStudioItemTarget"
              class="d-flex align-center"
            >
              <order-item-buttons :item="pageItem"> </order-item-buttons>
              <v-divider vertical class="ml-2 mr-3 my-auto"></v-divider>
            </div>
          </template>
        </info-label>
        <component
          v-else
          :is="layoutInput"
          :key="`k-${pageItem.variableName}`"
          :value="item.value"
          :wording="itemWording"
          :name="pageItem.variableName"
          :type="itemType"
          :disabled="!!item.specialValue || disabledClass"
          :metadata="metadata"
          :hideLabel="hideLabel || isStudioApply"
          :sectionProps="sectionProps"
          :modifier="modifiers"
          :classes="classes"
          @input="onValueEvent('input', $event)"
          @change="onValueEvent('change', $event)"
          @itemselected="$emit('itemselected', $event)"
        >
          <template v-slot:invalid-feedback>
            <item-messages
              v-if="!isStudioItemTarget"
              :messages="item.messages"
              @change="onMessagesEvent('change', $event)"
              :class="{ 'mt-2': mobile }"
            ></item-messages>
          </template>
          <template v-slot:pre-wording>
            <div
              v-if="isStudioMode && !isStudioElement && !isStudioItemTarget"
              class="d-flex align-center"
            >
              <order-item-buttons :item="pageItem"> </order-item-buttons>
              <v-divider vertical class="ml-2 mr-3 my-auto"></v-divider>
            </div>
          </template>
          <template v-slot:header>
            <status-icon
              v-if="itemType.name != 'info' && enabled"
              :status="status(item)"
              small
            ></status-icon>
            <information-comment
              :pageItem="pageItem"
              :modifier="modifiers"
              :classes="classes"
            ></information-comment>
          </template>
          <template v-slot:append>
            <div class="d-flex align-center justify-space-evenly">
              <clear-control
                v-if="
                  !isStudioApply &&
                    !isStudioPageSelector &&
                    !isStudioChoiceInput &&
                    !isStudioScoreInput &&
                    !disabledClass &&
                    clearableTypes
                "
                :name="pageItem.variableName"
                @clear="onClearEvent('change')"
              ></clear-control>
              <unit-input
                v-if="pageItem.units.values.length"
                :units="pageItem.units.values"
                :value="item.unit"
                :disabled="!!item.specialValue"
                :isExtendable="pageItem.units.isExtendable"
                @input="onUnitEvent('input', $event)"
                @change="onUnitEvent('change', $event)"
              ></unit-input>
              <special-value-input
                :value="item.specialValue"
                :special-values="applicableSpecialValues"
                v-if="
                  applicableSpecialValues.length &&
                    !isTransientVariable(item.pageItem.variableName) &&
                    !noSpecialClass
                "
                @input="onSpecialEvent('input', $event)"
                @change="onSpecialEvent('change', $event)"
                :compact="reducedSV"
              ></special-value-input>
              <status-icon
                v-if="
                  itemType.name != 'info' &&
                    (hideLabel || !itemWording) &&
                    enabled
                "
                :status="status(item)"
                small
              ></status-icon>
              <information-comment
                v-if="itemType.name != 'info' && (hideLabel || !itemWording)"
                :pageItem="pageItem"
                :modifier="modifiers"
                :classes="classes"
              ></information-comment>
            </div>
            <div
              v-if="isStudioMode && !isStudioElement && !hideStudio"
              class="mx-4 d-flex align-center"
            >
              <v-divider vertical></v-divider>
              <edit-item-button
                :item="pageItem"
                class="ml-4"
              ></edit-item-button>
              <delete-item-button
                :item="pageItem"
                class="ml-4"
              ></delete-item-button>
            </div>
          </template>
        </component>
      </transition>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import { Metadata, getItem, getItemType, getItemWording, status } from "uask-dom";
import SimpleItemInput from "./SimpleItemInput";
import RichItemInput from "./RichItemInput.vue";
import LangLabel from "../input/LangLabel.vue";
import UnitInput from "../input/UnitInput";
import SpecialValueInput from "../input/SpecialValueInput";
import StatusIcon from "./StatusIcon";
import InformationComment from "./InformationComment";
import EditItemButton from "../studio/EditItemButton";
import InfoLabel from "./InfoLabel";
import ItemMessages from "./ItemMessages";
import ClearControl from "../input/ClearControl";
import DeleteItemButton from "../studio/DeleteItemButton.vue";
import item from "../../mixin/item";
import OrderItemButtons from "../studio/OrderItemButtons.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      specialValues: ["notDefined", "notApplicable", "unknown"]
    };
  },
  model: {
    prop: "item"
  },
  props: [
    "item",
    "layout",
    "modifiers",
    "classes",
    "hideLabel",
    "reducedSV",
    "sectionProps",
    "hideStudio"
  ],
  computed: {
    ...mapGetters("studio", ["showInvisibleItems"]),
    pageItem() {
      return this.item.pageItem;
    },
    itemDefaultValue() {
      return this.item.value ?? this.item.pageItem.defaultValue;
    },
    itemType() {
      return getItemType(this.item);
    },
    itemWording() {
      return this.modifiers?.wording
        ? getItemWording({
            context: this.item.context,
            wording: this.modifiers.wording
          })
        : getItemWording(this.item);
    },
    metadata() {
      return new Metadata(this.pageItem, this.currentSurvey.rules);
    },
    applicableSpecialValues() {
      if (this.metadata.activable) return this.specialValuesForActivable;
      if (this.metadata.required) return [];
      return this.specialValues;
    },
    specialValuesForActivable() {
      if (this.item.specialValue == "notApplicable") return ["notApplicable"];
      if (this.metadata.required) return [];
      return this.specialValues.filter(e => e != "notApplicable");
    },
    visible() {
      const isVisible =
        !(
          this.metadata.showable && this.item.specialValue == "notApplicable"
        ) && this.showAcknowledgeItem;
      if (this.showInvisibleItems || isVisible)
        this.$emit("itemshown", { item: this.pageItem, visible: true });
      else this.$emit("itemshown", { item: this.pageItem, visible: false });
      return isVisible;
    },
    enabled() {
      return !(
        this.metadata.activable && this.item.specialValue == "notApplicable"
      );
    },
    showAcknowledgeItem() {
      if (
        this.item.pageItem.variableName ==
        this.currentSurvey.options.inclusionVar?.name
      )
        return !this.currentSurvey.options.inclusionVar.hidden;
      if (
        this.item.pageItem.variableName ==
        this.currentSurvey.options.signatureVar?.name
      )
        return !this.currentSurvey.options.signatureVar.hidden;
      return true;
    },
    layoutInput() {
      return this.layout == "richItem"
        ? "rich-item-input"
        : "simple-item-input";
    },
    isInfo() {
      return this.pageItem.type.name == "info";
    },
    index() {
      return this.currentPage.items.findIndex(
        i => getItem(i) == this.item.pageItem
      );
    },
    disabledClass() {
      return this.classes?.includes("disabled");
    },
    noSpecialClass() {
      return this.classes?.includes("no-specials");
    },
    clearableTypes() {
      return this.pageItem.type.name != "image";
    },
    isStudioItemTarget() {
      return this.isStudioMode && this.pageItem == this.currentItem;
    }
  },
  methods: {
    isTransientVariable(name) {
      return name.slice(0, 2) == "__";
    },
    status(obj) {
      return status(obj);
    }
  },
  watch: {
    isStudioItemTarget(val) {
      if (this.isStudioMode && val)
        this.$el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },
  components: {
    StatusIcon,
    SimpleItemInput,
    UnitInput,
    SpecialValueInput,
    InformationComment,
    RichItemInput,
    LangLabel,
    EditItemButton,
    InfoLabel,
    ItemMessages,
    ClearControl,
    DeleteItemButton,
    OrderItemButtons
  },
  mixins: [item]
};
</script>

<style>
.studioItemTarget {
  border-top: 3px solid #5e5ce6;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  pointer-events: none;
  background-color: #5e5ce6;
  color: whitesmoke;
  padding-bottom: 1em !important;
}

.studioItemTarget .value-input {
  display: none !important;
}

.studio {
  margin-left: 20px !important;
  margin-right: 20px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  border-left: 3px solid #5e5ce6;
  border-right: 3px solid #5e5ce6;
  margin: 0 !important;
}

.studioItem {
  background-color: #e9ddff;
}

.studioApply {
  border-bottom: 3px solid #5e5ce6;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 30px !important;
  background-color: #e9ddff;
}

.studio-section .studioApply {
  border: none;
}

.stamp {
  top: -1em;
  left: 93px;
  margin: 0;
  opacity: 0.6;
  border: none !important;
}

.studioItemTarget .stamp {
  left: 10px;
}
</style>
