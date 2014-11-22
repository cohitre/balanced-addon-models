import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:base", "adapter - Base");

test("#fetch", function() {
  var message = "Assertion Failed: Your adapter should override #fetch";
  var subject = this.subject();

  shouldThrowError(message, function() {
    subject.fetch("/marketplaces");
  });
});

test("#create", function() {
  var message = "Assertion Failed: Your adapter should override #create";
  var subject = this.subject();

  shouldThrowError(message, function() {
    subject.create("/marketplaces");
  });
});

test("#update", function() {
  var message = "Assertion Failed: Your adapter should override #update";
  var subject = this.subject();

  shouldThrowError(message, function() {
    subject.update("/marketplaces");
  });
});

test("#del", function() {
  var message = "Assertion Failed: Your adapter should override #del";
  var subject = this.subject();

  shouldThrowError(message, function() {
    subject.del("/marketplaces");
  });
});

function shouldThrowError(message, callback) {
  try {
    callback();
  }
  catch (e) {
    deepEqual(e.message, message);
  }
}
