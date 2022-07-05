export default {
  methods: {
    async reloadProfile() {
      const profile = await this.drivers.client.get("oidc/me").json();
      this.setProfile(profile);
    }
  }
};
