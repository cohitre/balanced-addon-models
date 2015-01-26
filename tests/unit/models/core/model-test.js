import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../../helpers/model-helpers";
import ErrorsHandler from "balanced-addon-models/models/error-handlers/base";

moduleFor("balanced-addon-models@model:account", "model - Core/Model");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("#getErrorsHandler", function() {
  var s = this.subject();

  deepEqual(s.getErrorsHandler().constructor, ErrorsHandler);
});

test("#getAdapter", function() {
  var s = this.subject();
  s.set("store", {
    adapterFor: sinon.stub()
  });

  s.getAdapter();
  deepEqual(s.get("store").adapterFor.args, [[s.constructor]]);
});

test("#getSerializer", function() {
  var s = this.subject();
  s.set("store", {
    serializerFor: sinon.stub()
  });

  s.getSerializer();
  deepEqual(s.get("store").serializerFor.args, [[s.constructor]]);
});

test("#updateUri", function() {
  var s = this.subject();
  s.set("__attributes.href", "/cool-href");
  deepEqual(s.get("updateUri"), "/cool-href");
});

test("#clearErrors", function() {
  var s = this.subject();
  s.get("errors.name").pushObject("That name is too cool");

  deepEqual(s.get("errors.name"), ["That name is too cool"]);
  s.clearErrors();
  deepEqual(s.get("errors.name"), []);
});

test("#save (new success)", function() {
  var s = this.subject();
  var adapter = {
    post: sinon.stub().returns(Ember.RSVP.resolve({}))
  };
  var serializer = {
    extractSingle: sinon.stub().returns({
      name: "Jim McSuperCool"
    })
  };

  sinon.stub(s, "getAdapter").returns(adapter);
  sinon.stub(s, "getSerializer").returns(serializer);
  s.getApiProperties = function() {
    return {
      heads: 1
    };
  };
  s.setProperties({
    createUri: "/humans"
  });

  s.save()
    .finally(function() {
      deepEqual(serializer.extractSingle.args, [[{}]]);
      deepEqual(adapter.post.args, [["/humans", {
        data: {
          heads: 1
        }
      }]]);
      deepEqual(s.get("__attributes.name"), "Jim McSuperCool");
    });
});

test("#save (existing success)", function() {
  var s = this.subject();
  var adapter = {
    update: sinon.stub().returns(Ember.RSVP.resolve({}))
  };
  var serializer = {
    extractSingle: sinon.stub().returns({
      name: "Jim McSuperCool"
    })
  };

  sinon.stub(s, "getAdapter").returns(adapter);
  sinon.stub(s, "getSerializer").returns(serializer);
  s.getApiProperties = function() {
    return {
      heads: 1
    };
  };
  s.setProperties({
    isNew: false,
    "__attributes.href": "/humans/1"
  });

  s.save()
    .finally(function() {
      deepEqual(serializer.extractSingle.args, [[{}]]);
      deepEqual(adapter.update.args, [["/humans/1", {
        data: {
          heads: 1
        }
      }]]);
      deepEqual(s.get("__attributes.name"), "Jim McSuperCool");
    });
});


test("#save (error)", function() {
  var s = this.subject();
  var adapter = {
    post: sinon.stub().returns(Ember.RSVP.reject({
      errors: [{
        extras: {
          name: "is not cool enough"
        }
      }]
    }))
  };

  sinon.stub(s, "getAdapter").returns(adapter);
  s.getApiProperties = function() {
    return {
      heads: 1
    };
  };
  s.setProperties({
    createUri: "/humans"
  });

  s.save()
    .finally(function() {
      deepEqual(adapter.post.args, [["/humans", {
        data: {
          heads: 1
        }
      }]]);
      deepEqual(s.get("errors.name"), ["is not cool enough"]);
    });
});
