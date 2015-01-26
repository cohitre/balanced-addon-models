import Ember from "ember";

export default Ember.Controller.extend({
  apiKey: "ak-test-2qrtvSaToU1tklKj1Js0YMlyoBipEkLHH",
  actions: {
    submit: function(apiKey) {
      var store = this.container.lookup("store:balanced");
      this.set("store", store);
      store.set("apiKey", apiKey);
      this.transitionToRoute("marketplace");
    },
  }
});
