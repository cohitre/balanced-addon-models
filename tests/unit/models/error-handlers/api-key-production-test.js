import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import ApiKeyProductionErrorHandler from "balanced-addon-models/models/error-handlers/api-key-production";

module("error-handler - ApiKeyProductionErrorHandler");

test("#addRootError", function() {
  var model = Ember.Object.create({
    errors: {
      _root: Ember.A()
    }
  });
  var s = ApiKeyProductionErrorHandler.create({
    model: model
  });

  s.addRootError("this model has been through some hard times");
  deepEqual(model.get("errors._root"), ["this model has been through some hard times"]);
});

