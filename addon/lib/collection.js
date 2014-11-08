import Ember from "ember";

export default Ember.ArrayProxy.extend({
  totalCount: Ember.computed.reads("meta.total"),
  isNextPage: Ember.computed("meta", function() {
    return !Ember.isBlank(this.get("meta.next"));
  }),

  reload: function() {
    var attr = this.get("attributes");
    this.set("content", Ember.A());
    return this.store.find(this.modelType, attr).then(loadResults.bind(this));
  },

  loadNext: function() {
    var next = this.get("meta.next");
    return this.store.findUri(this.modelType, next).then(loadResults.bind(this));
  },
});

function loadResults(results) {
  this.set("meta", results.get("balanced-meta"));
  this.pushObjects(results.get("content"));
  return this;
}
