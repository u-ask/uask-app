<template>
  <div>
    <v-app-bar v-show="variableNames.length" dense fixed bottom>
      <v-btn @click="copy()" :block="mobile" :text="mobile" color="primary"
        ><v-icon left>mdi-content-copy</v-icon>{{ $t("export") }}</v-btn
      >
    </v-app-bar>
    <v-snackbar
      v-model="copied"
      color="success"
      left
      bottom
      timeout="1000"
      class="mb-10"
    >
      {{ $t("copied") }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: ["variableNames", "kpiSet"],
  data() {
    return {
      copied: false
    };
  },
  methods: {
    async copy() {
      const matrix = this.kpiSet.select("@SAMPLE", ...this.variableNames);
      const rows = [];
      const headers = [...matrix.variableNames, "COUNT"];
      for (const value of [headers, ...matrix.data]) {
        const row = [];
        for (const col of value.slice(0, -1)) {
          if (typeof col == "string") row.push(`"${col.replace(/"/g, '""')}"`);
          else if (typeof col == "boolean") row.push(col ? 1 : 0);
          else row.push(col);
        }
        row.push(...value.slice(-1));
        rows.push(row.join(","));
      }
      const content = rows.join("\n");
      await navigator.clipboard.writeText(content);
      this.copied = true;
    }
  },
  i18n: {
    messages: {
      en: {
        export: "Copy KPIs to clipboard",
        copied: "KPIs copied"
      },
      fr: {
        export: "Copier les KPIs",
        copied: "KPIs copiés"
      }
    }
  }
};
</script>
