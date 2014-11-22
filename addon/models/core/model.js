import Ember from "ember";

var JSON_PROPERTY_KEY = '__json';
var URI_POSTFIX = '_uri';
var URI_METADATA_PROPERTY = '_uris';
var INTEGER_REGEX = /\b[0-9]+\b/;

var AJAX_ERROR_PARSERS = [{
	match: /insufficient-funds/gi,
	parse: function(error) {
		if (error.description) {
			error.description = error.description.replace(INTEGER_REGEX, function(m) {
				try {
					m = parseInt(m, 10);
					return Utils.formatCurrency(m);
				} catch (e) {}

				return m;
			});
		}

		return error;
	}
}];

var Model = Ember.Object.extend({
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

	save: function(settings) {
	},

	delete: function(settings) {
	},

	reload: function() {
		if (!this.get('isLoaded')) {
			return this;
		}

		var self = this;
		this.set('isLoaded', false);

		var promise = this.resolveOn('didLoad');

		this
			.constructor
			.getAdapter()
			.get(this.constructor, this.get('uri'), function(json) {
				var deserializedJson = self.constructor.serializer.extractSingle(json, self.constructor, self.get('href'));
				self._updateFromJson(deserializedJson);
				self.set('isLoaded', true);
				self.trigger('didLoad');
			}, $.proxy(self._handleError, self));

		return promise;
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

	_handleError: function(jqXHR, textStatus, errorThrown) {
		this.set('isSaving', false);

		if (jqXHR.status >= 400 && jqXHR.status < 500) {
			this.set('isValid', false);
			this.trigger('becameInvalid', jqXHR.responseJSON || jqXHR.responseText);
		} else {
			this.setProperties({
				isError: true,
				errorStatusCode: jqXHR.status
			});
			this.trigger('becameError', jqXHR.responseJSON || jqXHR.responseText);
		}

		if (jqXHR.responseJSON) {
			var res = jqXHR.responseJSON;

			if (res.errors && res.errors.length > 0) {
				var error = res.errors[0];

				_.each(AJAX_ERROR_PARSERS, function(ERROR_PARSER) {
					var doesMatch = false;
					if (_.isFunction(ERROR_PARSER.match)) {
						doesMatch = ERROR_PARSER.match(error);
					} else if (_.isRegExp(ERROR_PARSER.match)) {
						doesMatch = ERROR_PARSER.match.test(error.category_code);
					} else if (_.isString(ERROR_PARSER.match) && ERROR_PARSER.match === error.category_code) {
						doesMatch = true;
					} else if (!ERROR_PARSER.match) {
						doesMatch = true;
					}

					if (doesMatch) {
						error = ERROR_PARSER.parse(error);
					}
				});

				this.setProperties({
					validationErrors: Utils.extractValidationErrorHash(res),
					errorDescription: error.description,
					requestId: error.request_id,
					errorCategoryCode: error.category_code,
					lastError: error
				});
			} else {
				if (res.description) {
					this.set('errorDescription', res.description);
				}

				if (res.request_id) {
					this.set('requestId', res.requestId);
				}
			}
		}
	},

	_extractTypeClassFromUrisMetadata: function(uriProperty) {
		var uriMetadataProperty = JSON_PROPERTY_KEY + '.' + URI_METADATA_PROPERTY;

		var metadataType = this.get(uriMetadataProperty + '.' + uriProperty + '._type');
		if (metadataType) {
			var mappedType = TypeMappings.classForType(metadataType);
			if (mappedType) {
				return mappedType;
			} else {
				Ember.Logger.warn('Couldn\'t map _type of %@ for URI: %@'.fmt(metadataType, this.get('uri')));
			}
		}

		return undefined;
	},

	isEqual: function(a, b) {
		b = b || this;
		return Ember.get(a, 'id') === Ember.get(b, 'id');
	}
});

Model.reopenClass({
	constructUri: function(id) {
		var uri = this.create().get('uri');
		if (id) {
			return Utils.combineUri(uri, id);
		}
		return uri;
	},

	/*
	 * Used for adding a one-to-one association to a model.
	 *
	 * Params:
	 * - propertyName - The property whose value we'll get to determine the URI
	 *  or embedded data to use for the association
	 *  - defaultType - Used as a fallback in case the object doesn't have a
	 * _type or the _uris doesn't have data for this association
	 *
	 * Example:
	 *
	 * Marketplace = UserMarketplace.extend({
	 *      owner_customer: Model.belongsTo('owner_customer_json', 'customer')
	 * });
	 */
	belongsTo: function(propertyName, defaultType) {
		defaultType = defaultType || 'model';

		var embeddedProperty = JSON_PROPERTY_KEY + '.' + propertyName;
		var uriProperty = propertyName + URI_POSTFIX;
		var fullUriProperty = JSON_PROPERTY_KEY + '.' + propertyName + URI_POSTFIX;

		return Ember.computed(function() {
			var typeClass = TypeMappings.typeClass(defaultType);

			var embeddedPropertyValue = this.get(embeddedProperty);
			var uriPropertyValue = this.get(fullUriProperty);
			if (embeddedPropertyValue) {
				if (!embeddedPropertyValue._type) {
					embeddedPropertyValue = typeClass.serializer.extractSingle(embeddedPropertyValue, typeClass) || embeddedPropertyValue;
				}

				var embeddedObj = typeClass._materializeLoadedObjectFromAPIResult(embeddedPropertyValue);
				return embeddedObj;
			} else if (uriPropertyValue) {
				var metadataTypeClass = this._extractTypeClassFromUrisMetadata(uriProperty);
				if (metadataTypeClass) {
					typeClass = metadataTypeClass;
					return typeClass.find(uriPropertyValue);
				} else {
					// if we can't figure out what type it is from the
					// metadata, fetch it and set the result as an embedded
					// property in our JSON. That'll force an update of the
					// association
					var self = this;
					this
						.constructor
						.getAdapter()
						.get(defaultType, uriPropertyValue, function(json) {
							var modelJson = typeClass.serializer.extractSingle(json, typeClass, uriPropertyValue);
							self.set(embeddedProperty, modelJson);
						});

					return embeddedPropertyValue;
				}
			} else {
				return embeddedPropertyValue;
			}
		}).property(embeddedProperty, fullUriProperty);
	},

	/*
	 * Used for adding a one-to-many association to a model.
	 *
	 * Params:
	 * - propertyName - The property whose value we'll get to determine the URI
	 *  or embedded data to use for the association
	 *  - defaultType - Used to find/construct child objects. If the _type
	 * field is present in the returned JSON, we'll map that to create objects
	 * of the correct type. Since we use the type of object to pick which host
	 * to use, it's important to set the defaultType, even if your returned
	 * data uses the _type field.
	 *
	 * Example:
	 *
	 * Marketplace = UserMarketplace.extend({
	 *      customers: Model.hasMany('customers_json', 'customer')
	 * });
	 */
	hasMany: function(propertyName, defaultType) {
		defaultType = defaultType || 'model';

		var embeddedProperty = JSON_PROPERTY_KEY + '.' + propertyName;
		var uriProperty = propertyName + URI_POSTFIX;
		var fullUriProperty = JSON_PROPERTY_KEY + '.' + uriProperty;
		var uriMetadataProperty = JSON_PROPERTY_KEY + '.' + URI_METADATA_PROPERTY;

		return Ember.computed(function() {
			var typeClass = TypeMappings.typeClass(defaultType);
			var embeddedPropertyValue = this.get(embeddedProperty);
			// if the URI isn't defined in the JSON, check for a property on
			// the model. This way we can hardcode URIs if necessary to support
			// undocumented URIs
			var uriPropertyValue = this.get(fullUriProperty) || this.get(uriProperty);

			if (embeddedPropertyValue) {
				return ModelArray.newArrayCreatedFromJson(embeddedPropertyValue, defaultType);
			} else if (uriPropertyValue) {
				return ModelArray.newArrayLoadedFromUri(uriPropertyValue, defaultType);
			} else {
				return ModelArray.create({
					content: Ember.A(),
					typeClass: typeClass
				});
			}
		}).property(embeddedProperty, uriProperty, fullUriProperty, uriMetadataProperty + '.@each');
	},

	_materializeLoadedObjectFromAPIResult: function(json) {
		var UserMarketplace = require("balanced-dashboard/models/user-marketplace")['default'];
		var UserInvite = require("balanced-dashboard/models/user-invite")['default'];

		var objClass = this;

		if (json._type) {
			var mappedTypeClass = TypeMappings.classForType(json._type);
			if (mappedTypeClass) {
				objClass = mappedTypeClass;
			}
		} else {
			// HACK - once we fix the API response from the auth proxy, we should take out the if
			if (objClass !== UserMarketplace && objClass !== UserInvite) {
				Ember.Logger.warn('No _type field found on URI: ' + json.uri);
			}
		}

		var typedObj = objClass.create();
		typedObj.set('isNew', false);
		typedObj._updateFromJson(json);
		typedObj.trigger('didLoad');

		return typedObj;
	},

	_isEmbedded: function(propertyName, settings) {
		settings = settings || {};

		var embedded = !(/_uri$/.test(propertyName));
		if (settings.hasOwnProperty('embedded')) {
			embedded = settings.embedded;
		}

		return embedded;
	}
});

export default Model;
