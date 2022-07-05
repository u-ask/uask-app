<template>
  <div v-resize="onResize" class="d-flex flex-column">
    <a href="/">
      <img
        v-if="!$vuetify.breakpoint.smAndDown"
        :src="logoURL"
        lazy-src="/img/LogoAroneSVG.svg"
        :height="customLogo ? 40 : 70"
        max-width="150"
        alt="logo arone"
        contain
      />
    </a>
    <span
      v-if="customLogo && !$vuetify.breakpoint.smAndDown"
      class="text-white d-inline-flex justify-end align-center"
    >
      <div class="h6 text-white">Powered by</div>
      <img
        class="ml-1"
        v-if="!$vuetify.breakpoint.smAndDown"
        src="/img/LogoAroneSVG.svg"
        height="30"
        alt="poweredBy"
        contain
      />
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoURL: undefined,
      logoPending: false
    };
  },
  computed: {
    customLogo() {
      return this.logoURL != "/img/LogoAroneSVG.svg";
    }
  },
  methods: {
    async onResize() {
      this.logoURL = undefined;
      await this.getLogo();
    },
    async getLogo() {
      if (!this.logoPending) {
        this.logoPending = true;
        const allDocuments = await this.drivers.documentDriver.getAll(
          this.currentSurvey
        );
        const logoHash = allDocuments.find(d => d.title == "__logo__")?.hash;

        const { shortToken } = await this.drivers?.client
          ?.get("shorttoken/generate")
          .json();
        this.logoURL = logoHash
          ? `${process.env.VUE_APP_API_URL}/document/${this.currentSurvey.name}/${logoHash}/content?shortToken=${shortToken}`
          : "/img/LogoAroneSVG.svg";
        this.logoPending = false;
      }
    }
  }
};
</script>
