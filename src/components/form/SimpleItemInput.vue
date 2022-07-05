<template>
  <div :id="name" :class="{ 'py-3': !mobile, 'py-0': mobile }">
    <div
      :class="[
        orientationClass(
          'px-0 py-0',
          'd-md-inline-flex align-center px-0 py-0'
        ),
        'col-12'
      ]"
    >
      <padding :classes="classes"></padding>
      <div
        v-if="!hideLabel"
        :class="[orientationClass('', layout), 'd-flex mr-3 py-0']"
      >
        <span
          v-on="
            withAuditTrail ? { click: () => $emit('itemselected', name) } : {}
          "
        >
          <span class="d-flex flex-row align-center">
            <slot name="pre-wording"></slot>
            <lang-label
              :class="[infoClass('font-italic text-dark', audittrailClass)]"
              :labels="wording"
            ></lang-label>
          </span>
        </span>
        <slot name="header"></slot>
      </div>
      <div
        :class="[
          orientationClass('col-12 d-flex pb-0', 'col'),
          'd-md-inline-flex',
          'value-input',
          'px-0',
          'py-0',
          'align-center'
        ]"
      >
        <div class="col px-1 px-md-3 py-0">
          <value-input
            v-if="!isInfo"
            :disabled="disabled"
            :value="value"
            @input="$emit('input', $event)"
            @change="$emit('change', $event)"
            :name="name"
            :type="type"
            :metadata="metadata"
            :labels="wording"
            :classes="classes"
          >
          </value-input>
          <lang-label v-else :labels="value"></lang-label>
          <slot v-if="hideLabel" name="invalid-feedback"></slot>
        </div>
        <slot
          v-if="!isInfo"
          class="d-inline-flex align-self-center flex-shrink-1"
          name="append"
        ></slot>
      </div>
      <div>
        <slot name="footer"></slot>
      </div>
    </div>
    <div class="px-4">
      <slot v-if="!hideLabel" name="invalid-feedback" class="col"></slot>
    </div>
  </div>
</template>

<script>
import LangLabel from "../input/LangLabel";
import ValueInput from "../input/ValueInput.vue";
import Padding from "./Padding.vue";

export default {
  props: [
    "name",
    "wording",
    "type",
    "value",
    "disabled",
    "metadata",
    "hideLabel",
    "status",
    "sectionProps",
    "classes"
  ],
  computed: {
    withAuditTrail() {
      return (
        !this.isStudioMode && this.$route.name != "Item details" && !this.isInfo
      );
    },
    isInfo: function() {
      return this.type.name == "info";
    },
    audittrailClass() {
      return this.withAuditTrail ? "audit-trail" : "";
    },
    layout() {
      const mean = this.sectionProps?.meanLength
        ? this.sectionProps?.meanLength
        : this.getLabel("mlstring", {}, this.wording, this.$i18n).length;
      if (this.isStudioItem) return "col-2";
      else
        return mean
          ? mean > 15
            ? mean > 30
              ? "col-6"
              : "col-4"
            : "col-2"
          : "col-auto";
    }
  },
  methods: {
    orientationClass(classesCol, classesRow) {
      return this.mobile || this.isInfo ? classesCol : classesRow;
    },
    infoClass(classesInfo, classesNotInfo) {
      return this.isInfo ? classesInfo : classesNotInfo;
    }
  },
  components: {
    ValueInput,
    LangLabel,
    Padding
  }
};
</script>

<style scoped>
.limited-width {
  max-width: 50% !important;
}

.audit-trail {
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
}

.audit-trail:hover {
  background-color: #f2f3f8;
}
</style>
