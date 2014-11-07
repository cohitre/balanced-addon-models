import Ember from "ember";

export default Ember.Route.extend({
  beforeModel: function() {
    var apiKey = this.get("container").lookup("adapter:application").get("apiKey");
    if (!apiKey) {
      this.transitionTo("application");
    }
  },

  model: function() {
    return this.store.find("marketplace").then(function(mps) {
      return mps.objectAt(0);
    });
  },
});
