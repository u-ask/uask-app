import { getItemWording } from "uask-dom";

export default {
  data() {
    return {
      sectionContent: {},
      sectionProps: {},
      clearPending: false
    };
  },
  methods: {
    onItemShown(index, event) {
      const content = Object.assign({}, this.sectionContent[index], {
        [event.item.variableName]: event
      });
      this.sectionContent[index] = content;
      const itemCount = Object.values(content).filter(s => s.visible).length;
      const lengths = Object.values(content)
        .filter(s => s.item.type.name != "info" && s.visible)
        .map(el => {
          return this.getLabel(
            "mlstring",
            {},
            getItemWording(el.item),
            this.$i18n
          ).length;
        });
      const meanLength =
        lengths.reduce((acc, val) => {
          return acc + val;
        }, 0) / lengths.length;
      this.$set(this.sectionProps, index, {
        index,
        itemCount,
        meanLength
      });
    },
    clearSections() {
      if (!this.clearPending) {
        this.clearPending = true;
        this.sectionContent = {};
        this.sectionProps = {};
        this.$nextTick(() => {
          this.clearPending = false;
        });
      }
    },
    getSectionProps(sectionIndex) {
      return this.sectionProps[sectionIndex];
    },
    sectionVisible(sectionIndex) {
      return !!this.getSectionProps(sectionIndex)?.itemCount;
    }
  }
};
