<template>
  <div>
    <section-pagination
      :instance="instance"
      :count="count"
      :role="role"
      @newrecord="newRecord()"
      @cancelrecord="cancelRecord($event)"
      @instancechanged="instance = $event"
      :class="role == 'standalone' ? 'mb-n5' : ''"
    ></section-pagination>
    <section-content
      :section="record"
      :currentProps="sectionProps"
      no-plus-button
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @itemshown="$emit('itemshown', $event)"
      @itemselected="
        $emit('itemselected', { name: $event, instance: instance })
      "
      :class="
        role == 'standalone' ? 'border border-secondary px-0 pt-5 rounded' : ''
      "
    >
    </section-content>
  </div>
</template>

<script>
export default {
  name: "SectionRecordset",
  props: ["content", "sectionProps"],
  components: {
    SectionContent: () => import("./SectionContent.vue"),
    SectionPagination: () => import("./SectionPagination.vue")
  },
  data() {
    return {
      instance: 1,
      record: {}
    };
  },
  computed: {
    count() {
      return this.content.items.length;
    },
    role() {
      return this.currentPage.array ? "slave" : "standalone";
    }
  },
  methods: {
    getRecord(instance) {
      const record = this.content.items[instance - 1];
      if (instance == 1 || this.isComplete(record))
        return this.zipTables(record);
      const prevRecord = this.getRecord(instance - 1);
      if (prevRecord) this.fillMissing(record, prevRecord);
    },
    setIf(instance, resolve) {
      const rec = this.getRecord(instance);
      if (rec != undefined) {
        if (resolve) resolve();
        this.record = rec;
      } else this.setIfAsync(instance, resolve);
    },
    setIfAsync(instance, resolve) {
      if (resolve) this.setRetry(instance, resolve);
      this.setRetry(instance, () => {
        this.instance = instance;
      });
    },
    setRetry(instance, resolve) {
      const unwatch = this.$watch("content", () => {
        this.setIf(instance, resolve);
        unwatch();
      });
    },
    isComplete(record) {
      return (
        record &&
        record.length == this.content.columns.length &&
        record.every(r => r != undefined)
      );
    },
    zipTables(record) {
      return record.reduce(
        (r, item) => (r[r.length - 1]?.behavior == "table" ? r : [...r, item]),
        []
      );
    },
    newRecord() {
      this.setIf(this.count + 1);
    },
    cancelRecord(instance) {
      this.setIf(instance - 1);
    },
    flattenRecord(record) {
      return record.reduce((items, r) => {
        if (r?.behavior == "table") return this.flattenTable(r, items);
        items.push(r);
        return items;
      }, []);
    },
    flattenTable(table, items) {
      return table.items.reduce((items, r) => {
        items.push(...r.row.filter(item => !!item));
        return items;
      }, items);
    },
    fillMissing(record, prevRecord) {
      const current = record ? this.flattenRecord(record) : [];
      const previous = this.flattenRecord(prevRecord);
      const missing = this.findMissing(previous, current);
      const items = missing.map(r => {
        const pageItem = r.item.pageItem.nextInstance();
        const position = r.item.position;
        return { pageItem, position };
      });
      this.$emit("newitems", items);
    },
    findMissing(previous, current) {
      return previous.filter(r =>
        current.every(t => t?.item.pageItem != r.item.pageItem.nextInstance())
      );
    }
  },
  watch: {
    currentPage() {
      this.setIf(1);
    },
    instance(i) {
      this.setIf(i);
    }
  },
  mounted() {
    this.record = this.getRecord(1);
  }
};
</script>
