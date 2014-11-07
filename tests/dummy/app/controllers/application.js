import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    submit: function(apiKey) {
      this.get("container").lookup("adapter:application").set("apiKey", apiKey);
      this.transitionToRoute("marketplace");
    },
  }
});
