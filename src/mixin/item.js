import { getItemUnits } from "uask-dom";

export default {
  methods: {
    onValueEvent(ev, value) {
      this.send(
        ev,
        value,
        this.item.unit ?? getItemUnits(this.item).length == 1
          ? getItemUnits(this.item)[0]
          : undefined,
        this.item.specialValue,
        this.item.messages
      );
    },
    onSpecialEvent(ev, specialValue) {
      this.send(
        ev,
        specialValue ? undefined : this.item.value,
        specialValue ? undefined : this.item.unit,
        specialValue,
        specialValue ? {} : this.item.messages
      );
    },
    onUnitEvent(ev, unit) {
      this.send(
        ev,
        this.item.value,
        unit,
        this.item.specialValue,
        this.item.messages
      );
    },
    onMessagesEvent(ev, messages) {
      this.send(
        ev,
        this.item.value,
        this.item.unit,
        this.item.specialValue,
        messages
      );
    },
    onClearEvent(ev) {
      this.send(ev, undefined, undefined, undefined, undefined);
    },
    send(ev, value, unit, specialValue, messages) {
      const item = Object.assign({}, this.item, {
        value,
        unit,
        specialValue,
        messages
      });
      this.$emit(ev, item);
    }
  }
};
