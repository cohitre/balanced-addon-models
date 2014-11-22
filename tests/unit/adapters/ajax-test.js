import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:ajax", "adapter - Ajax");

test("#ajax", function() {
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve({}));

  var subject = this.subject();
  subject.ajax("/customers", "GET");

  deepEqual(stub.args, [
    [
      "/customers",
      {
        "accepts": undefined,
        "contentType": undefined,
        "dataType": "json",
        "headers": undefined,
        "method": "GET"
      }
    ]
  ]);

  stub.restore();
});

test("#fetch", function() {
  var serializer = {
    extractCollection: sinon.stub().returns({
      items: []
    })
  };
  var container = {
    lookup: sinon.stub().returns(serializer)
  };
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));

  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
    container: container
  });
  subject.fetch("/marketplaces").then(function(r) {
    deepEqual(serializer.extractCollection.args, [[
      "..."
    ]]);
    deepEqual(jQuery.ajax.args, [["https://api.bp.com/marketplaces", {
      accepts: undefined,
      contentType: undefined,
      dataType: "json",
      headers: undefined,
      method: "GET",
    }]]);
    stub.restore();
  });
});

test("#post", function() {
  var serializer = {
    extractCollection: sinon.stub().returns({
      items: []
    })
  };
  var container = {
    lookup: sinon.stub().returns(serializer)
  };
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));

  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
    container: container
  });
  var data = {
    data: {
      name: "Cool"
    }
  };
  subject.post("/marketplaces", data).then(function(r) {
    deepEqual(serializer.extractCollection.args, [[
      "..."
    ]]);
    deepEqual(jQuery.ajax.args, [["https://api.bp.com/marketplaces", {
      accepts: undefined,
      contentType: undefined,
      dataType: "json",
      headers: undefined,
      method: "POST",
      data: {
        name: "Cool"
      }
    }]]);
    stub.restore();
  });
});

test("#update", function() {
  var serializer = {
    extractCollection: sinon.stub().returns({
      items: []
    })
  };
  var container = {
    lookup: sinon.stub().returns(serializer)
  };
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));

  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
    container: container
  });
  var data = {
    data: {
      name: "Cool"
    }
  };
  subject.update("/marketplaces", data).then(function(r) {
    deepEqual(serializer.extractCollection.args, [[
      "..."
    ]]);
    deepEqual(jQuery.ajax.args, [["https://api.bp.com/marketplaces", {
      accepts: undefined,
      contentType: undefined,
      dataType: "json",
      headers: undefined,
      method: "PUT",
      data: {
        name: "Cool"
      }
    }]]);
    stub.restore();
  });
});

test("#del", function() {
  var serializer = {
    extractCollection: sinon.stub().returns({
      items: []
    })
  };
  var container = {
    lookup: sinon.stub().returns(serializer)
  };
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));

  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
    container: container
  });
  subject.del("/marketplaces").then(function(r) {
    deepEqual(serializer.extractCollection.args, [[
      "..."
    ]]);
    deepEqual(jQuery.ajax.args, [["https://api.bp.com/marketplaces", {
      accepts: undefined,
      contentType: undefined,
      dataType: "json",
      headers: undefined,
      method: "DELETE",
    }]]);
    stub.restore();
  });
});

test("#getSerializer", function() {
  var container = {
    lookup: sinon.stub()
  };

  var subject = this.subject();
  subject.setProperties({
    container: container,
    serializerName: "serializer:cool"
  });

  subject.getSerializer();

  deepEqual(container.lookup.args, [["serializer:cool"]]);
});
