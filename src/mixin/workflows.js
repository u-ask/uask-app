export default {
  computed: {
    allRoles() {
      const roles = [
        { value: "administrator", text: this.$t("roles.administrator") },
        { value: "writer", text: this.$t("roles.investigator") },
        { value: "reader", text: this.$t("roles.cst") }
      ];
      return this.isUserProfile ? roles : roles.slice(1);
    },
    knownWorkflows() {
      return this.currentSurvey.workflows
        .filter(w => w.name != "main")
        .map(w => {
          const [role, specifier] = w.name.split(":");
          const roleText = this.allRoles.find(r => r.value == role)?.text;
          return {
            value: w.name,
            text: `${roleText} (${specifier})`
          };
        });
    },
    allWorkflows() {
      return [...this.knownWorkflows, ...this.allRoles]
        .sort((a, b) => a.text.localeCompare(b.text))
        .filter((v, x, arr) => x == 0 || arr[x - 1].value != v.value);
    },
    isHomePage() {
      return this.currentPageSet == this.currentSurvey.mainWorkflow.info;
    }
  }
};
