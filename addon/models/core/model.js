import Ember from "ember";
import EmberValidations from 'ember-validations';
import ErrorsHandler from "../error-handlers/base";
import BK from "./method-generators";

var Model = Ember.Object.extend(EmberValidations.Mixin, {
  id: Ember.computed.reads("__attributes.id").readOnly(),

  href: BK.attr("href").readOnly(),
  updateUri: Ember.computed.reads("href").readOnly(),
  deleteUri: Ember.computed.reads("href").readOnly(),
  createdAt: BK.attrStringToDate("created_at"),
  updatedAt: BK.attrStringToDate("updated_at"),

  getErrorsHandler: function() {
    return ErrorsHandler.create({
      model: this
    });
  },
  getAdapter: function() {
    return this.get("store").adapterFor(this.constructor);
  },

  getSerializer: function() {
    return this.get("store").serializerFor(this.constructor);
  },

	isLoaded: false,
	isSaving: false,
	isDeleted: false,
	isNew: Ember.computed.not("id"),

  __attributes: Ember.computed(function() {
    return Ember.Object.create();
  }).readOnly(),

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
    this.set("isSaving", true);
    var successHandler = function(response) {
      var item = self.getSerializer().extractSingle(response);
      self.set("isSaving", false);
      return self.ingestJsonItem(item);
    };
    var errorHandler = function(response) {
      var errorsHandler = self.getErrorsHandler();
      errorsHandler.populateFromResponse(response);
      self.set("isSaving", false);
      return Ember.RSVP.reject(self);
    };

    return this
      .validate()
      .then(function() {
        if (self.get("isNew")) {
          return self.createInstance();
        }
        else {
          return self.updateInstance();
        }
      })
      .then(successHandler, errorHandler);
	},

  createInstance: function() {
    return this.getAdapter()
      .post(this.get("createUri"), {
        data: this.getApiProperties()
      });
  },

  updateInstance: function() {
    return this.getAdapter()
      .update(this.get("updateUri"), {
        data: this.getApiProperties()
      });
  },


  /**
   * Quick method that updates only certain properties
   */
  updateProperties: function(data) {
    var self = this;
    var href = this.get("updateUri");
    var settings = {
      data: data
    };

    return this.getAdapter().update(href, settings)
      .then(function(response) {
        var item = self.getSerializer().extractSingle(response);
        return self.ingestJsonItem(item);
      }, function(response) {
        var errorsHandler = self.getErrorsHandler();
        errorsHandler.populateFromResponse(response);
        return Ember.RSVP.reject(self);
      });
  },

  getApiProperties: function() {
    Ember.assert("core/model#getApiProperties method is not implemented in object "+ this, false);
  },

  delete: function() {
    return this.getAdapter().del(this.get("deleteUri"));
  },

  reload: function() {
    var self = this;
    return self.getAdapter()
      .fetch(this.get("href"))
      .then(function(response) {
        var item = self.getSerializer().extractSingle(response);
        return self.ingestJsonItem(item);
      });
  },

	ingestJsonItem: function(json) {
    json = json || {};
    this.get("__attributes").setProperties(json);
    this.set("isLoaded", true);
    return this;
	},

	isEqual: function(a, b) {
		b = b || this;
		return Ember.get(a, 'id') === Ember.get(b, 'id');
	}
});

Model.reopenClass({
  serializerName: "balanced-addon-models@serializer:rev1",
  adapterName: "balanced-addon-models@adapter:balanced-api",
  collectionName: "balanced-addon-models@collection:base",
  queryHandlerName: "balanced-addon-models@query-handler:base"
});

export default Model;
