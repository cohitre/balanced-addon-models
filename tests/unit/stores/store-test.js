import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@store:balanced", "store - Balanced");

test("#modelPathFor", function() {
  var store = this.subject();
  store.modelMaps.automobile = "model:automobile";

  deepEqual(store.modelPathFor("hold"), "balanced-addon-models@model:card_hold");
  deepEqual(store.modelPathFor("marketplace"), "balanced-addon-models@model:marketplace");
  deepEqual(store.modelPathFor("automobile"), "model:automobile");

});

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
  stub.onCall(0).returns({
    collectionName: "balanced-addon-models@collection:base"
  });
  stub.onCall(1).returns({
    create: function() {}
  });
  stub.onCall(2).returns({
    collectionName: "balanced-addon-models@collection:customer"
  });
  stub.onCall(3).returns({
    create: function() {}
  });

  var container = {
    lookupFactory: stub
  };
  var subject = this.subject();
  subject.set("container", container);

  subject.collectionFor("transaction");
  subject.collectionFor("customer");

  deepEqual(container.lookupFactory.args, [
    ["balanced-addon-models@model:transaction"],
    ["balanced-addon-models@collection:base"],
    ["balanced-addon-models@model:customer"],
    ["balanced-addon-models@collection:customer"]
  ]);
});
