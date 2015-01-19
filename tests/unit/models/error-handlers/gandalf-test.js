import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import GandalfBaseErrorHandler from "balanced-addon-models/models/error-handlers/gandalf-base";

module("error-handler - GandalfBaseErrorHandler");

test("#populateFromResponse", function() {
  var ERROR_RESPONSE = {
    "business_type":["This field is required."],
    "owner_phone_number":["This field is required."]
  };

  var model = Ember.Object.create({
    errors: {
      _root: Ember.A(),
      business_type: Ember.A(),
      owner_phone_number: Ember.A()
    }
  });
  var s = GandalfBaseErrorHandler.create({
    model: model
  });

  s.populateFromResponse(ERROR_RESPONSE);

  deepEqual(model.errors, {
    "_root": [],
    "business_type": [
      "This field is required."
    ],
    "owner_phone_number": [
      "This field is required."
    ]
  });
});
