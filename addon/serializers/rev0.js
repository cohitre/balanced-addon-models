import Ember from "ember";

var JSON_PROPERTY_KEY = '__json';

var Rev0Serializer = Ember.Object.extend({
	//  properties which are not echoed back to the server
	privateProperties: ['id', 'uri', 'validationErrors', JSON_PROPERTY_KEY, 'links', '_type'],

	serialize: function(record) {
		var json = this._propertiesMap(record);
		return json;
	},

	extractSingle: function(rootJson) {
		return rootJson;
	},

	extractCollection: function(rootJson) {
		return rootJson;
	},
});

export default Rev0Serializer;
