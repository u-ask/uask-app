export default {
  computed: {
    allRoles() {
      return [
        { value: "writer", text: this.$t("roles.writer") },
        { value: "reader", text: this.$t("roles.reader") },
        { value: "administrator", text: this.$t("roles.administrator") },
        {
          value: "superadministrator",
          text: this.$t("roles.superadministrator")
        },
        { value: "developer", text: this.$t("roles.developer") }
      ];
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
      const workflows = [];
      for (const role of this.allRoles)
        workflows.push(
          role,
          ...this.knownWorkflows.filter(w => w.value.startsWith(role.value))
        );
      return workflows;
    },
    isHomePage() {
      return this.currentPageSet == this.currentSurvey.mainWorkflow.info;
    }
  }
};
