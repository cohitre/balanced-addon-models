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

test("#ingestResponse", function() {
  var items = [1, 2, 3];
  var subject = this.subject();
  subject.setProperties({
    content: [4]
  });
  subject.ingestResponse(items, [3, 4, 2]);
  deepEqual(subject.get("content"), [4, 1, 2, 3]);
  deepEqual(subject.get("meta"), [3, 4, 2]);
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
