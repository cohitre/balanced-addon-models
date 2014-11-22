import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@store:balanced", "store - Balanced");

test("#modelFor", function() {
  var container = {
    lookupFactory: sinon.stub().returns({})
  };
  var subject = this.subject();
  subject.set("container", container);
  subject.modelFor("hold");
  subject.modelFor("marketplace");

  deepEqual(container.lookupFactory.args, [
    ["balanced-addon-models@model:card_hold"],
    ["balanced-addon-models@model:marketplace"]
  ]);
});

test("#adapterFor", function() {
  var stub = sinon.stub();
  stub.onCall(0).returns({
    adapterName: "balanced-addon-models@adapter:application"
  });
  stub.onCall(1).returns({
    create: function() {}
  });

  var container = {
    lookupFactory: stub
  };
  var subject = this.subject();
  subject.set("container", container);
  subject.adapterFor("marketplace");

  deepEqual(container.lookupFactory.args, [
    ["balanced-addon-models@model:marketplace"],
    ["balanced-addon-models@adapter:application"]
  ]);
});

test("#collectionFor", function() {
  var stub = sinon.stub();
  stub.onCall(0).returns(undefined);
  stub.onCall(1).returns("cool collection");

  var container = {
    lookupFactory: stub
  };
  var subject = this.subject();
  subject.set("container", container);

  subject.collectionFor("customers");

  deepEqual(container.lookupFactory.args, [
    ["balanced-addon-models@collection:customers"],
    ["balanced-addon-models@collection:base"]
  ]);
});

test("#processResponse", function() {
  var subject = this.subject();

  var result = subject.processResponse({ items: [] });
  deepEqual(result, []);
});
