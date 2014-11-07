import Ember from "ember";

export default Ember.ObjectController.extend({
  needs: ["marketplace"],
  customers: Ember.computed(function() {
    return this.get("controllers.marketplace.model").getCustomersCollection({
      sort: "created_at",
      limit: 20
    });
  }).property(),

  actions: {
    reload: function(collection) {
      return collection.reload();
    },

    loadNext: function(collection) {
      return collection.loadNext();
    },
  }
});
