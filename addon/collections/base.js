import Ember from "ember";

export default Ember.ArrayProxy.extend({
  isLoaded: false,
  isLoadingNextPage: false,

  nextUri: Ember.computed.reads("meta.next"),
  totalCount: Ember.computed.reads("meta.total"),

  hasNextPage: Ember.computed("meta", function() {
    return !Ember.isBlank(this.get("nextUri"));
  }),

  ingestResponse: function(items, meta) {
    this.set("meta", meta);
    this.pushObjects(items);
    this.set("isLoaded", true);
    return items;
  },

  loadUri: function(uri) {
    return this.get("store").loadIntoCollection(this.modelType, this, uri);
  },

  loadNext: function() {
    return this.loadUri(this.get("nextUri"));
  },
});
