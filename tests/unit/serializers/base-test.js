import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@serializer:base", "serializer - Base");

test("#extractCollection", function() {
  try {
    this.subject().extractCollection();
  }
  catch (e) {
    deepEqual(e.message, "Assertion Failed: Serializer must implement extractCollection method");
  }
});

test("#extractSingle", function() {
  try {
    this.subject().extractSingle();
  }
  catch (e) {
    deepEqual(e.message, "Assertion Failed: Serializer must implement extractSingle method");
  }
});
