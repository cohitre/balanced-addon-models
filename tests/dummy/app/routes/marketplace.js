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
    return this.getStore().fetchItem("marketplace", "/marketplaces");
  },

  setupController: function(controller, model) {
    model.fetchCustomers().then(function(collection) {
      controller.set("customers", collection);
    });

    model.fetchTransactions().then(function(collection) {
      controller.set("transactions", collection);
    });
  },
});
