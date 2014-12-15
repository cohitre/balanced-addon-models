import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:bank-account-verification", "model - BankAccountVerification");

test("#adapter", MH.shouldUseBalancedApiAdapter());

test("#isVerified", stateTest("isVerified", "verified"));
test("#isFailed", stateTest("isFailed", "failed"));
test("#isSuccess", stateTest("isSuccess", "deposit_succeeded"));
test("#isPending", stateTest("isPending", "pending"));

test("#attemptsRemaining", MH.shouldRead("attemptsRemaining", "attempts_remaining"));
test("#isVerifiable", function() {
  var s = this.subject();

  s.set("attempts_remaining", 3);
  deepEqual(s.get("isVerifiable"), true);

  s.set("attempts_remaining", 0);
  deepEqual(s.get("isVerifiable"), false);
});

function stateTest(stateName, stateValue) {
  return function() {
    var subject = this.subject();
    deepEqual(subject.get(stateName), false);
    subject.set("verification_status", stateValue);
    deepEqual(subject.get(stateName), true);
  };
}
