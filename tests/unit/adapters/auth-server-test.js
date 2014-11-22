import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:auth-server", "adapter - AuthServer");

test("defaults", function() {
  var subject = this.subject();
  var properties = subject.getProperties("serializerName", "host", "accepts", "contentType");

  deepEqual(properties, {
    accepts: "application/vnd.balancedpayments+json; version=1.1",
    contentType: "application/json; charset=UTF-8",
    host: "https://auth.balancedpayments.com",
    serializerName: "balanced-addon-models@serializer:rev0"
  });
});
