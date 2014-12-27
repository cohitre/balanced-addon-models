import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import BaseErrorsHandler from "balanced-addon-models/models/error-handlers/base";

module("error-handler - BaseErrorsHandler");

test("#addErrorToField", function() {
  var model = Ember.Object.create({
    errors: {
      name: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.addErrorToField("name", "name is too cool");
  deepEqual(model.get("errors.name"), ["name is too cool"]);
});

test("#addErrorsToField", function() {
  var model = Ember.Object.create({
    errors: {
      name: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.addErrorsToField("name", ["name is too cool", "coolness can't be handled"]);
  deepEqual(model.get("errors.name"), [
    "name is too cool",
    "coolness can't be handled"
  ]);
});

test("#addRootError", function() {
  var model = Ember.Object.create({
    errors: {
      _root: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.addRootError("this model has been through some hard times");
  deepEqual(model.get("errors._root"), ["this model has been through some hard times"]);
});

test("#handleApiResponse", function() {
  var ERROR_RESPONSE = {
    "errors": [{
      "extras": {
        "email": '"invalid-email" must be a valid email address'
      }
    }, {
      "description": "Not cool enough [email] - A coolness error was triggered by your email"
    }, {
      "description": "Seriously, that email is awful."
    }]
  };

  var model = Ember.Object.create({
    errors: {
      email: Ember.A(),
      _root: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.handleApiResponse(ERROR_RESPONSE);

  deepEqual(model.get("errors"), {
    "_root": [
      "A coolness error was triggered by your email",
      "Seriously, that email is awful.",
      "There was a validation error when submitting your request."
    ],
    "email": ['"invalid-email" must be a valid email address']
  });
});

test("#handleUnknownError", function() {
  var model = Ember.Object.create({
    errors: {
      _root: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.handleUnknownError();

  deepEqual(model.get("errors"), {
    "_root": ["There was an error processing your request."]
  });
});

test("#populateFromResponse (known)", function() {
  var ERROR_RESPONSE = {
    "errors": [{
      "extras": {
        "email": '"invalid-email" must be a valid email address'
      }
    }]
  };

  var model = Ember.Object.create({
    errors: {
      email: Ember.A(),
      _root: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.populateFromResponse(ERROR_RESPONSE);

  deepEqual(model.get("errors"), {
    "_root": ["There was a validation error when submitting your request."],
    "email": ['"invalid-email" must be a valid email address']
  });
});

test("#populateFromResponse (unknown)", function() {
  var ERROR_RESPONSE = {};

  var model = Ember.Object.create({
    errors: {
      _root: Ember.A()
    }
  });
  var s = BaseErrorsHandler.create({
    model: model
  });

  s.populateFromResponse(ERROR_RESPONSE);

  deepEqual(model.get("errors"), {
    "_root": ["There was an error processing your request."]
  });
});
