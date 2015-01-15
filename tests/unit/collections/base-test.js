import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@collection:base", "collection - BaseCollection");

test("#nextUri", function() {
  var subject = this.subject();
  subject.set("meta", {
    next: "/marketplaces"
  });

  deepEqual(subject.get("nextUri"), "/marketplaces");
});

test("#totalCount", function() {
  var subject = this.subject();
  subject.set("meta", {
    total: 100
  });
  deepEqual(subject.get("totalCount"), 100);
});

test("#hasNextPage", function() {
  var subject = this.subject();
  subject.set("meta", {
    next: "/marketplaces"
  });
  deepEqual(subject.get("hasNextPage"), true);
  subject.set("meta", {});
  deepEqual(subject.get("hasNextPage"), false);
});

test("#loadUri", function(uri) {
  var store = buildStubbedStore();
  var subject = this.subject();

  subject.setProperties({
    store: store,
    modelType: "customer",
    content: []
  });
  subject.loadUri("/customers");
  deepEqual(store.loadIntoCollection.args, [["customer", subject, "/customers"]]);
});

test("#loadUris", function() {
  var store = buildStubbedStore();
  var s = this.subject();

  s.setProperties({
    store: store,
    modelType: "marketplace",
    content: [],
    nextUri: "/marketplaces"
  });

  deepEqual(s.get("isLoaded"), false);

  s.loadUris(["/uri1", "/uri2"])
    .then(function() {
      deepEqual(s.get("isLoaded"), true);
      deepEqual(store.loadIntoCollection.args, [
        ["marketplace", s, "/uri1"],
        ["marketplace", s, "/uri2"]
      ]);
    });
});

test("#loadUris (error)", function() {
  var store = {
    loadIntoCollection: sinon.stub()
  };
  store.loadIntoCollection.onCall(0).returns(Ember.RSVP.resolve({}));
  store.loadIntoCollection.onCall(1).returns(Ember.RSVP.reject({}));
  var s = this.subject();

  s.setProperties({
    store: store,
    modelType: "marketplace",
    content: [],
    nextUri: "/marketplaces"
  });

  deepEqual(s.get("isLoaded"), false);

  s.loadUris(["/uri1", "/uri2"])
    .then(undefined, function() {
      deepEqual(s.get("isLoaded"), true);
      deepEqual(store.loadIntoCollection.args, [
        ["marketplace", s, "/uri1"],
        ["marketplace", s, "/uri2"]
      ]);
    });
});

test("#loadNext", function() {
  var store = buildStubbedStore();

  var subject = this.subject();
  subject.setProperties({
    store: store,
    modelType: "marketplace",
    content: [],
    nextUri: "/marketplaces"
  });
  subject.loadNext();
  deepEqual(store.loadIntoCollection.args, [["marketplace", subject, "/marketplaces"]]);
});

function buildStubbedStore() {
  var response = {
    meta: {
      next: "/cool"
    },
    items: []
  };
  return {
    loadIntoCollection: sinon.stub().returns(Ember.RSVP.resolve(response))
  };
}
