import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@model:status-calculators/bank-account-verification-status", "status-calculator - BankAccountVerificationStatus");

test("bank account cannot credit (has been removed)", function() {
  var subject = this.subject();
  subject.set("bankAccount", Ember.Object.create({
    canCredit: false
  }));

  deepEqual(subject.get("value"), "unverifiable");
  deepEqual(subject.get("alertType"), "danger");
  deepEqual(subject.get("label"), "Unverifiable");
});

test("bank account can debit", function() {
  var subject = this.subject();
  subject.set("bankAccount", Ember.Object.create({
    canCredit: true,
    canDebit: true
  }));

  deepEqual(subject.get("value"), "verified");
  deepEqual(subject.get("alertType"), "success");
  deepEqual(subject.get("label"), "Verified");
});

test("bank account has no customer", function() {
  var subject = this.subject();
  subject.set("bankAccount", Ember.Object.create({
    hasCustomer: false
  }));

  deepEqual(subject.get("value"), "unverifiable");
  deepEqual(subject.get("alertType"), "danger");
  deepEqual(subject.get("label"), "Unverifiable");
});

test("#forBankAccountVerification (none)", function() {
  var subject = this.subject();
  subject.forBankAccountVerification();

  deepEqual(subject.get("value"), "unverified");
  deepEqual(subject.get("alertType"), "warning");
  deepEqual(subject.get("label"), "Unverified");
});

test("#forBankAccountVerifications (pending)", function() {
  var subject = this.subject();
  subject.forBankAccountVerification(Ember.Object.create({
    isPending: true
  }));

  deepEqual(subject.get("value"), "pending");
  deepEqual(subject.get("alertType"), "warning");
  deepEqual(subject.get("label"), "Verification pending");
});

test("#forBankAccountVerifications (failed)", function() {
  var subject = this.subject();
  subject.forBankAccountVerification(Ember.Object.create({
    isFailed: "failed"
  }));

  deepEqual(subject.get("value"), "failed");
  deepEqual(subject.get("alertType"), "danger");
  deepEqual(subject.get("label"), "Verification failed");
});

test("#forBankAccountVerifications (unknown status)", function() {
  var subject = this.subject();
  subject.forBankAccountVerification(Ember.Object.create());

  deepEqual(subject.get("value"), "unknown");
  deepEqual(subject.get("alertType"), "danger");
  deepEqual(subject.get("label"), "Unknown verification state");
});
