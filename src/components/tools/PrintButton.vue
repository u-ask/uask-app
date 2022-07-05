<template>
  <div>
    <v-btn
      :id="id"
      v-if="!compact"
      @click="print()"
      color="primary"
      :outlined="outlined"
      rounded
    >
      {{ title }}
      <v-icon class="ml-1">mdi-printer</v-icon>
    </v-btn>
    <v-chip v-if="compact" @click="print()" color="primary" icon>
      <v-icon>mdi-printer</v-icon>
    </v-chip>

    <div
      v-if="!!printHttpGet"
      :class="printToDiv ? 'divHttpGet' : 'printHttpGet'"
    >
      <v-chip
        v-if="printToDiv"
        @click="clear()"
        color="primary"
        class="float-right"
      >
        close
      </v-chip>
      <div :id="hiddenid" v-html="printHttpGet"></div>
    </div>
  </div>
</template>

<script>
import printJS from "print-js";

export default {
  props: ["id", "title", "compact", "outlined", "css", "get", "element"],
  data() {
    return {
      printHttpGet: undefined
    };
  },
  computed: {
    hiddenid() {
      return `print-${Math.trunc(Math.random() * 10000)}`;
    },
    printToDiv() {
      return process.env.VUE_APP_PRINT_TO_DIV === "true";
    },
    printOptions() {
      return {
        printable: this.element ?? this.hiddenid,
        type: "html",
        targetStyle: ["*"],
        css: this.css,
        documentTitle: this.title
      };
    }
  },
  methods: {
    retrieveHtml() {
      return this.drivers.client
        .get(this.get)
        .text()
        .then(res => {
          this.printHttpGet = res;
        });
    },
    p() {
      if (!this.printToDiv)
        this.$nextTick(() => {
          printJS(this.printOptions);
          this.clear();
        });
    },
    clear() {
      this.printHttpGet = undefined;
    },
    async print() {
      if (this.element) this.p();
      else
        await this.retrieveHtml().then(() => {
          this.p();
        });
    }
  }
};
</script>

<style scoped>
.printHttpGet {
  display: none;
}

.divHttpGet {
  position: fixed;
  top: 3em;
  left: 3em;
  right: 3em;
  bottom: 3em;
  z-index: 500;
  padding: 1em;
  border: blue solid 5px;
  background: white;
  overflow: auto;
}

@media print {
  .printHttpGet {
    display: block;
  }
}
</style>

<style>
.divHttpGet .item {
  display: flex;
}
.divHttpGet .item-part {
  margin-right: 5px;
}
</style>
