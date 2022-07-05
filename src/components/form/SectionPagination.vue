<template>
  <div class="d-flex justify-content-center align-items-center" v-if="show">
    <v-pagination
      :value="instance"
      @next="instanceChanged(instance + 1)"
      @previous="instanceChanged(instance - 1)"
      @input="instanceChanged($event)"
      :length="length"
      circle
      class="px-1 bg-white"
    >
    </v-pagination>
    <div class="bg-white">
      <v-btn
        dark
        icon
        class="mp-1 mr-3 success v-pagination__item--active"
        @click="newRecord()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="pr-2 bg-white">
      <cancel-button
        :show="showCancel"
        @done="cancelRecord($event)"
      ></cancel-button>
    </div>
  </div>
</template>

<script>
import mitt from "mitt";
import CancelButton from "./CancelButton.vue";

const $bus = mitt();

export default {
  props: ["instance", "count", "role"],
  data() {
    return {
      length: 1,
      showCancel: false
    };
  },
  computed: {
    show() {
      if (this.role == "master") return !!this.currentPage?.array;
      if (this.role == "slave") return false;
      return true;
    }
  },
  methods: {
    instanceChanged(value) {
      if (this.role == "master") $bus.emit("instancechanged", value);
      this.$emit("instancechanged", value);
    },
    newRecord() {
      this.showCancel = true;
      if (this.role == "master") $bus.emit("newrecord");
      this.$emit("newrecord");
      this.length += 1;
      this.instanceChanged(this.length);
    },
    cancelRecord(canceled) {
      this.showCancel = false;
      if (canceled) {
        if (this.role == "master") $bus.emit("cancelrecord", canceled);
        this.$emit("cancelrecord", this.instance);
        this.length -= 1;
        this.instanceChanged(this.length);
      }
    }
  },
  mounted() {
    this.length = this.count ?? 0;
    if (this.role == "slave") {
      $bus.on("instancechanged", this.instanceChanged);
      $bus.on("newrecord", this.newRecord);
      $bus.on("cancelrecord", this.cancelRecord);
      this.$nextTick(() => {
        $bus.emit("count", this.count);
      });
    }
    if (this.role == "master") {
      $bus.on("count", c => {
        if (c > this.length) this.length = c;
      });
    }
  },
  beforeDestroy() {
    if (this.role == "slave") {
      $bus.off("instancechanged", this.instanceChanged);
      $bus.off("nenwrecord", this.newRecord);
    }
    if (this.role == "master") {
      $bus.off("count");
    }
  },
  watch: {
    currentPage() {
      this.showCancel = false;
      if (this.role == "master") this.length = 1;
      this.instanceChanged(1);
      if (this.role == "slave")
        this.$nextTick(() => {
          $bus.emit("count", this.count);
        });
    }
  },
  components: {
    CancelButton
  }
};
</script>
