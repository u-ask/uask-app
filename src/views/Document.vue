<template>
  <v-row>
    <v-col cols="12" class="py-0" v-if="canAdd">
      <add-document></add-document>
    </v-col>
    <v-col cols="12" class="py-0">
      <document-filter
        @input="filter = $event"
        :options="options"
      ></document-filter>
      <v-divider v-if="mobile"></v-divider>
    </v-col>
    <v-col cols="12" :class="mobile ? 'py-0' : ''">
      <document-list @input="options = $event" :filter="filter"></document-list>
    </v-col>
  </v-row>
</template>

<script>
import DocumentList from "../components/document/DocumentList";
import DocumentFilter from "../components/document/DocumentFilter";
import AddDocument from "../components/document/AddDocument";

export default {
  data: function() {
    return {
      filter: {},
      options: {}
    };
  },
  components: {
    DocumentList,
    DocumentFilter,
    AddDocument
  },
  computed: {
    canAdd() {
      return this.authorizationManager.canSaveDocument();
    }
  }
};
</script>
