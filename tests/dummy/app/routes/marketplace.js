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

    collectionGetter(s, controller, "getCustomers", "customers");
    collectionGetter(s, controller, "getTransactions", "transactions");
    collectionGetter(s, controller, "getApiKeys", "apiKeys");
  },
});

function collectionGetter(store, controller, methodName, propertyName) {
  store[methodName]().then(function(collection) {
    controller.set(propertyName, collection);
  });
}
