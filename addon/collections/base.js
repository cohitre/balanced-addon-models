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
    var self = this;
    var store = this.get("store");
    return store.fetch(this.modelType, uri).then(function(response) {
      self.ingestResponse(response.items, response.meta);
      return self;
    });
  },

  loadNext: function() {
    var uri = this.get("nextUri");
    return this.loadUri(uri);
  },
});
