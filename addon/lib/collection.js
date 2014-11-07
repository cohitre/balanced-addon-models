import Ember from "ember";

export default Ember.ArrayProxy.extend({
  page: 0,
  reload: function() {
    var modelType = this.get("modelType");
    var attributes = this.get("attributes");

    var callback = function(results) {
      this.pushObjects(results.get("content"));
      return this;
    }.bind(this);

    this.set("content", Ember.A());
    return this.store.find(modelType, attributes).then(callback);
  },

  loadNext: function() {
    this.incrementProperty("page");
    var modelType = this.get("modelType");
    var attributes = Ember.merge({
      offset: this.get("page") * this.get("attributes.limit")
    }, this.get("attributes"));

    var callback = function(results) {
      this.pushObjects(results.get("content"));
      return this;
    }.bind(this);

    return this.store.find(modelType, attributes).then(callback);
  },
});
