import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    submit: function(apiKey) {
      var store = this.container.lookup("store:balanced");
      this.set("store", store);
      store.set("apiKey", apiKey);
      window.store = store;
      this.transitionToRoute("marketplace");
    },
  }
});
