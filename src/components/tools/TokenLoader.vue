<template>
  <v-dialog v-model="dialog" persistent width="300">
    <v-card color="light">
      <v-card-text>
        {{ $t("events.loading") }}
        <v-progress-linear
          indeterminate
          color="blue"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  props: ["url"],
  watch: {
    async url() {
      if (!this.url) {
        this.dialog = false;
      } else {
        this.dialog = true;
        const shortToken = await this.getShortToken();
        this.download(shortToken);
        this.setPoller(shortToken);
      }
    }
  },
  methods: {
    async getShortToken() {
      const { shortToken } = await this.drivers.client
        .get("shorttoken/generate")
        .json();
      return shortToken;
    },
    download(shortToken) {
      window.location = `${this.url}?shortToken=${shortToken}`;
    },
    setPoller(shortToken) {
      setTimeout(this.poller, 3000, shortToken, 1000);
    },
    async poller(shortToken, lastDelay) {
      const { processed } = await this.drivers.client
        .get(`shorttoken/processed?shortToken=${shortToken}`, {
          timeout: 90000
        })
        .json();
      if (processed) {
        this.finished();
      } else {
        const delay = lastDelay == 10000 ? lastDelay : lastDelay + 1000;
        setTimeout(this.poller, delay, shortToken, delay);
      }
    },
    finished() {
      this.dialog = false;
      this.$emit("finished");
    }
  }
};
</script>
