import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    loadNext: function(collection) {
      collection.loadNext();
    },
  }
});
