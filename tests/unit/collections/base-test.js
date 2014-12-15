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
  var store = {
    processResponse: sinon.stub().returns([1, 2, 3])
  };
  var response = {
    meta: [3, 4, 2]
  };
  var subject = this.subject();
  subject.setProperties({
    store: store,
    content: [4]
  });
  subject.ingestResponse(response);

  deepEqual(store.processResponse.args, [[response]]);
  deepEqual(subject.get("content"), [4, 1, 2, 3]);
});

test("#loadUri", function(uri) {
  var store = {
    processResponse: sinon.stub().returns([]),
    fetch: sinon.stub().returns(Ember.RSVP.resolve({
      meta: "metaFields",
      items: []
    }))
  };

  var subject = this.subject();
  subject.setProperties({
    store: store,
    modelType: "customer",
    content: []
  });
  subject.loadUri("/customers").then(function(s) {
    deepEqual(s.get("meta"), "metaFields");
    equal(subject, s);
    deepEqual(store.fetch.args, [["customer", "/customers"]]);
  });
});

test("#loadNext", function() {
  var store = {
    processResponse: sinon.stub().returns([]),
    fetch: sinon.stub().returns(Ember.RSVP.resolve({
      meta: "metaFields",
      items: []
    }))
  };

  var subject = this.subject();
  subject.setProperties({
    store: store,
    modelType: "marketplace",
    content: [],
    nextUri: "/marketplaces"
  });
  subject.loadNext().then(function(s) {
    deepEqual(s.get("meta"), "metaFields");
    equal(subject, s);
    deepEqual(store.fetch.args, [["marketplace", "/marketplaces"]]);
  });
});
