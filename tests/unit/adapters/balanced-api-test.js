import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:balanced-api", "adapter - BalancedApiAdapter", {});

test("#host", function() {
  var subject = this.subject();

  equal(subject.get("host"), "https://api.balancedpayments.com");
});

test("#headers", function() {
  var subject = this.subject();
  subject.set("encodedAuthorization", "cool-authorization");
  deepEqual(subject.get("headers"), {
    Authorization: "cool-authorization"
  });
});

test("#encodedAuthorization", function() {
  var subject = this.subject();
  subject.set("apiKey", "ak-test-xxxxxxxxxxxxxxxxxxxxxxxxxxx");
  deepEqual(subject.get("encodedAuthorization"), "Basic YWstdGVzdC14eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHg6");
});
