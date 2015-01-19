import Ember from "ember";

var GandalfSerializer = Ember.Object.extend({
  extractSingle: function(rootJson) {
    return rootJson;
  },

  // Gandalf returns results as an array
	extractCollection: function(rootJson) {
    var collection = Ember.A(rootJson);
    collection.forEach(function(value) {
      value.uri = value.href;
      value._type = "marketplace-application";
    });

		return {
			items: collection,
			linked: {},
      meta: {}
		};
	},
});

export default GandalfSerializer;
