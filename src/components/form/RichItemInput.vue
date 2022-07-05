<template>
  <div class="py-3">
    <span class="d-flex flex-row align-center">
      <slot name="pre-wording"></slot>
      <div v-if="wording">
        <lang-label
          v-if="wording"
          :labels="wording"
          class="col text-h6"
        ></lang-label>
        <slot name="header"></slot>
      </div>
    </span>
    <div class="d-lg-inline-flex align-md-center col p-0 value-input">
      <div
        :class="[
          'col',
          withAuditTrail ? 'audit-trail' : '',
          wording ? 'text-lg-right' : ''
        ]"
        v-on="
          withAuditTrail ? { click: () => $emit('itemselected', name) } : {}
        "
      >
        <lang-label
          :labels="modifier.leftWording"
          :class="[
            'col',
            wording ? 'd-flex justify-center justify-lg-end' : ''
          ]"
        ></lang-label>
      </div>
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
        :expanded="true"
        :classes="classes"
        :class="['col-lg-4', wording ? 'd-flex justify-center' : '']"
      ></value-input>
      <div
        class="col"
        :class="withAuditTrail ? 'audit-trail' : ''"
        v-on="
          withAuditTrail ? { click: () => $emit('itemselected', name) } : {}
        "
      >
        <lang-label
          :labels="modifier.rightWording"
          :class="[
            'col',
            wording ? 'd-flex justify-center justify-lg-start' : ''
          ]"
        ></lang-label>
      </div>
      <slot name="append"></slot>
    </div>
    <div>
      <slot name="footer"></slot>
    </div>
    <v-divider v-if="$vuetify.breakpoint.smAndDown"></v-divider>
  </div>
</template>

<script>
import ValueInput from "../input/ValueInput";
import LangLabel from "../input/LangLabel.vue";

export default {
  components: {
    ValueInput,
    LangLabel
  },
  props: [
    "name",
    "wording",
    "type",
    "value",
    "disabled",
    "metadata",
    "modifier",
    "classes"
  ],
  computed: {
    isInfo: function() {
      return this.type.name == "info";
    },
    withAuditTrail() {
      return (
        !this.isStudioMode && this.$route.name != "Item details" && !this.isInfo
      );
    }
  }
};
</script>

<style>
.audit-trail {
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
}

.audit-trail:hover {
  background-color: #f2f3f8;
}
</style>
