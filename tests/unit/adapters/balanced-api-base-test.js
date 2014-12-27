import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:balanced-api-base", "adapter - BalancedApiBaseAdapter");

test("default", function() {
  var subject = this.subject();
  var properties = subject.getProperties("host", "accepts", "contentType");

  deepEqual(properties, {
    accepts: {
      json: "application/vnd.api+json;revision=1.1"
    },
    contentType: "application/json; charset=UTF-8",
    host: "https://api.balancedpayments.com",
  });
});

test("#host", function() {
  var subject = this.subject();
  equal(subject.get("host"), "https://api.balancedpayments.com");
});

test("#headers", function() {
  var subject = this.subject();
  deepEqual(subject.get("headers"), {});
});
