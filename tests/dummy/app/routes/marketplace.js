import Ember from "ember";

export default Ember.Route.extend({
  getStore: function() {
    return this.controllerFor("application").get("store");
  },

  beforeModel: function() {
    if (!this.getStore()) {
      this.transitionTo("application");
    }
  },

  model: function() {
    return this.getStore().getMarketplace();
  },

  setupController: function(controller, model) {
    var s = this.getStore();
    controller.set("model", model);
    s.getCustomers()
      .then(function(collection) {
        controller.set("customers", collection);
      });

    s.getTransactions()
      .then(function(collection) {
        controller.set("transactions", collection);
      });
  },
});
