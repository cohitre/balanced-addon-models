import Ember from "ember";

export default Ember.ArrayProxy.extend({
  nextUri: Ember.computed.reads("meta.next"),
  totalCount: Ember.computed.reads("meta.total"),

  isNextPage: Ember.computed("meta", function() {
    return !Ember.isBlank(this.get("nextUri"));
  }),

  ingestResponse: function(response) {
    this.set("meta", response.meta);
    var items = this.get("store").processResponse(response);
    this.pushObjects(items);
    return items;
  },

  loadUri: function(uri) {
    var store = this.get("store");
    return store.fetch(this.modelType, uri).then(function(response) {
      this.ingestResponse(response);
      return this;
    }.bind(this));
  },

  loadNext: function() {
    var uri = this.get("nextUri");
    return this.loadUri(uri);
  },
});
