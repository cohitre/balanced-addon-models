import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:ajax", "adapter - Ajax");

test("#_uri", function() {
  var s = this.subject();

  s.set("host", "http://some-host");
  deepEqual(s._uri("/some-path"), "http://some-host/some-path");
});

test("#ajax", function() {
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve({}));

  var subject = this.subject();
  subject.ajax("/customers", "GET");
  stub.restore();

  deepEqual(stub.args, [
    [
      "/customers",
      {
        accepts: undefined,
        contentType: undefined,
        dataType: "json",
        headers: undefined,
        method: "GET",
        context: subject
      }
    ]
  ]);
});

test("#fetch", function() {
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));
  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
  });

  subject.fetch("/marketplaces");
  deepEqual(stub.args, [["https://api.bp.com/marketplaces", {
    accepts: undefined,
    contentType: undefined,
    dataType: "json",
    headers: undefined,
    method: "GET",
    context: subject
  }]]);
  stub.restore();
});

test("#post", function() {
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));
  var data = {
    data: {
      name: "Cool"
    }
  };
  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
  });
  subject.post("/marketplaces", data);
  deepEqual(stub.args, [["https://api.bp.com/marketplaces", {
    contentType: undefined,
    dataType: "json",
    headers: undefined,
    method: "POST",
    accepts: undefined,
    context: subject,
    data: '{"name":"Cool"}'
  }]]);
  stub.restore();
});

test("#update", function() {
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));
  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
  });
  var data = {
    data: {
      name: "Cool"
    }
  };
  subject.update("/marketplaces", data);
  deepEqual(stub.args, [["https://api.bp.com/marketplaces", {
    accepts: undefined,
    contentType: undefined,
    dataType: "json",
    headers: undefined,
    method: "PUT",
    context: subject,
    data: '{"name":"Cool"}'
  }]]);
  stub.restore();
});

test("#del", function() {
  var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve("..."));
  var subject = this.subject();
  subject.setProperties({
    host: "https://api.bp.com",
  });
  subject.del("/marketplaces");
  deepEqual(stub.args, [["https://api.bp.com/marketplaces", {
    accepts: undefined,
    contentType: undefined,
    dataType: "json",
    headers: undefined,
    method: "DELETE",
    context: subject,
  }]]);
  stub.restore();
});
