import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:bank-account-verification", "model - BankAccountVerification");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("#isVerified", stateTest("isVerified", "verified"));
test("#isFailed", stateTest("isFailed", "failed"));
test("#isDepositSuccess", depositStateTest("isDepositSuccess", "succeeded"));
test("#isPending", stateTest("isPending", "pending"));

test("#isVerifiable", function() {
  var s = this.subject();

  s.set("__attributes.attempts_remaining", 3);
  deepEqual(s.get("isVerifiable"), true);

  s.set("__attributes.attempts_remaining", 0);
  deepEqual(s.get("isVerifiable"), false);
});

test("properties", function() {
  var s = this.subject();
  s.ingestJsonItem({
    "verification_status": "pending",
    "links": {
      "bank_account": "BAxxxxxxxxxxxxxxxxx"
    },
    "href": "/verifications/BZxxxxxxxxxxxxxx",
    "created_at": "2014-08-19T07:39:47.808277Z",
    "attempts_remaining": 3,
    "updated_at": "2014-08-19T07:39:48.129411Z",
    "deposit_status": "succeeded",
    "attempts": 0,
    "meta": {},
    "id": "BZxxxxxxxxxxxxxx"
  });

  MH.shouldMatch(s, {
    isVerified: false,
    isFailed: false,
    isPending: true,
    isDepositSuccess: true,
    attemptsRemaining: 3,
    isVerifiable: true
  });
});

function stateTest(stateName, stateValue) {
  return function() {
    var subject = this.subject();
    deepEqual(subject.get(stateName), false);
    subject.set("__attributes.verification_status", stateValue);
    deepEqual(subject.get(stateName), true);
  };
}

function depositStateTest(stateName, stateValue) {
  return function() {
    var subject = this.subject();
    deepEqual(subject.get(stateName), false);
    subject.set("__attributes.deposit_status", stateValue);
    deepEqual(subject.get(stateName), true);
  };
}
