import Ember from "ember";
import EmberValidations from 'ember-validations';
import ErrorsHandler from "./errors-handler";

var Model = Ember.Object.extend(EmberValidations.Mixin, {
  getAdapter: function() {
    return this.store.adapterFor(this.constructor);
  },

	isLoaded: false,
	isSaving: false,
	isDeleted: false,
	isNew: true,

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

  updateUri: Ember.computed.reads("href").readOnly(),

  clearErrors: function() {
    var errors = this.get("errors");
    for (var key in errors) {
      if (Ember.typeOf(errors[key]) === "array") {
        errors[key].clear();
      }
    }
  },
	save: function() {
    var self = this;
    this.clearErrors();
    var successHandler = function(response) {
      self.ingestJsonItem(response.items[0]);
      return self;
    };
    var errorHandler = function(response) {
      ErrorsHandler.handle(self, response);
      return Ember.RSVP.reject(self);
    };

    var adapter = this.getAdapter();
    var settings = {
      data: this.getApiProperties()
    };
    var promise;

    if (this.get("isNew")) {
      promise = adapter.post(this.get("createUri"), settings);
    }
    else {
      promise = adapter.update(this.get("updateUri"), settings);
    }

    return promise.then(successHandler, errorHandler);
	},

  getApiProperties: function() {
    Ember.assert("core/model#apiProperties method is not implemented in object "+ this, false);
  },

	delete: function() {
    Ember.assert("core/model#delete method is not implemented", false);
	},

	reload: function() {
    Ember.assert("core/model#reload method is not implemented", false);
	},

	ingestJsonItem: function(json) {
    this.setProperties(json);
    this.set("isLoaded", true);
    return this;
	},

	isEqual: function(a, b) {
		b = b || this;
		return Ember.get(a, 'id') === Ember.get(b, 'id');
	}
});

Model.reopenClass({
});

export default Model;
