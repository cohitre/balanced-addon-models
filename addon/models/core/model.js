import Ember from "ember";

var JSON_PROPERTY_KEY = '__json';

var Model = Ember.Object.extend({
  getAdapter: function() {
    return this.store.adapterFor(this.constructor);
  },

	isLoaded: false,
	isSaving: false,
	isDeleted: false,
	isError: false,
	isNew: true,
	isValid: true,

	id: Ember.computed.or('__json.id', '_id'),

	// computes the ID from the URI - exists because at times Ember needs the
	// ID of our model before it has finished loading. This gets overridden
	// when the real model object gets loaded by the ID value from the JSON
	// attribute
	_id: function() {
		var uri = this.get('uri');

		if (uri) {
			return uri.substring(uri.lastIndexOf('/') + 1);
		}
	}.property('uri'),

	save: function() {
    Ember.assert("core/model#save method is not implemented", false);
	},

	delete: function() {
    Ember.assert("core/model#delete method is not implemented", false);
	},

	reload: function() {
    Ember.assert("core/model#reload method is not implemented", false);
	},

	populateFromJsonResponse: function(json) {
		var decodingUri = this.get('isNew') ? null : this.get('uri');
		var modelJson = this.constructor.serializer.extractSingle(json, this.constructor, decodingUri);

		if (modelJson) {
			this._updateFromJson(modelJson);
		} else {
			this.setProperties({
				isNew: false,
				isError: true
			});

			this.trigger('becameError');
		}
	},

	_updateFromJson: function(json) {
		var self = this;
		if (!json) {
			return;
		}

		var changes = {
			isNew: false
		};
		changes[JSON_PROPERTY_KEY] = json;

		this.setProperties(changes);

		Ember.changeProperties(function() {
			for (var prop in json) {
				if (json.hasOwnProperty(prop)) {
					var desc = Ember.meta(self.constructor.proto(), false).descs[prop];
					// don't override computed properties with raw json
					if (!(desc && desc instanceof Ember.ComputedProperty)) {
						self.set(prop, json[prop]);
					}
				}
			}
		});

		this.set('isLoaded', true);
		this.trigger('didLoad');
	},

	isEqual: function(a, b) {
		b = b || this;
		return Ember.get(a, 'id') === Ember.get(b, 'id');
	}
});

Model.reopenClass({
});

export default Model;
