import Ember from "ember";

var BaseSerializer = Ember.Object.extend({
	extractCollection: function() {
    Ember.assert("Serializer must implement extractCollection method", false);
	},

  extractSingle: function() {
    Ember.assert("Serializer must implement extractSingle method", false);
  }
});

export default BaseSerializer;
