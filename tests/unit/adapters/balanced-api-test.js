import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:balanced-api", "adapter - BalancedApiAdapter");

test("default", function() {
  var subject = this.subject();
  var properties = subject.getProperties("serializerName", "host", "accepts", "contentType");

  deepEqual(properties, {
    serializerName: "balanced-addon-models@serializer:rev1",
    host: "https://api.balancedpayments.com",
    accepts: "application/vnd.balancedpayments+json; version=1.1",
    contentType: "application/json; charset=UTF-8",
  });
});

test("#host", function() {
  var subject = this.subject();
  equal(subject.get("host"), "https://api.balancedpayments.com");
});

test("#headers", function() {
  var subject = this.subject();
  subject.set("api_key", "cool-authorization");
  deepEqual(subject.get("headers"), {
    Authorization: "Basic Y29vbC1hdXRob3JpemF0aW9uOg=="
  });
});

test("#encodedApiKey", function() {
  var subject = this.subject();
  deepEqual(subject.get("encodedApiKey"), null);
  subject.set("api_key", "ak-test-xxxxxxxxxxxxxxxxxxxxxxxxxxx");
  deepEqual(subject.get("encodedApiKey"), "Basic YWstdGVzdC14eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHg6");
});
