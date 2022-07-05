import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters("studio", [
      "isStudioMode",
      "currentItem",
      "pendingStudioModification",
      "unfoldedItem"
    ]),
    isStudioApply() {
      return this.classes?.includes("studioApply");
    },
    isStudioElement() {
      return (
        this.classes?.includes("studio") ||
        this.classes?.includes("studioPage") ||
        this.classes?.includes("studioPageSet") ||
        this.classes?.includes("studioWorkflow")
      );
    },
    isStudioItem() {
      return (
        this.classes?.includes("studioItem") ||
        this.classes?.includes("studioPage") ||
        this.classes?.includes("studioPageSet") ||
        this.classes?.includes("studioWorkflow")
      );
    },
    isStudioInput: function() {
      return this.classes?.some(el =>
        [
          "studioInRange",
          "studioChoiceInput",
          "studioScoreInput",
          "studioPageSelector",
          "studioPageSetSelector",
          "studioNotificationSelector",
          "studioUnitInput",
          "studioLangSelector"
        ].includes(el)
      );
    },
    isStudioScoreInput() {
      return this.classes?.includes("studioScoreInput");
    },
    isStudioChoiceInput() {
      return !!this.classes?.includes("studioChoiceInput");
    },
    isStudioSection() {
      if (this.title) {
        const title =
          typeof this.title == "string" ? this.title : this.title["en"];
        return (
          [
            "Update Page",
            "Insert Page",
            "Update Interview",
            "Update Workflow",
            "New interview type",
            "Insert Workflow",
            "Delete Workflow",
            "Update survey options"
          ].some(p => title.startsWith(p)) ||
          ["Delete workflow", "Delete page", "Delete pageset"].some(words =>
            title.startsWith(words)
          )
        );
      }

      return false;
    },
    isStudioUnitInput() {
      return this.classes?.includes("studioUnitInput");
    },
    isStudioPageSelector() {
      return this.classes?.includes("studioPageSelector");
    },
    isStudioNotificationSelector() {
      return this.classes?.includes("studioNotificationSelector");
    },
    isStudioPageSetSelector() {
      return this.classes?.includes("studioPageSetSelector");
    },
    isStudioLangSelector() {
      return this.classes?.includes("studioLangSelector");
    },
    isMultiple() {
      return this.classes?.includes("multiple");
    },
    noCode() {
      return this.classes?.includes("noCode");
    }
  },
  methods: {
    ...mapMutations("studio", [
      "setStudioMode",
      "setPendingStudioModification",
      "setUnfoldedItem"
    ])
  }
};
