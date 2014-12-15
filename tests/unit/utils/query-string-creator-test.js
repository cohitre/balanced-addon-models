import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import QueryStringCreator from "balanced-addon-models/utils/query-string-creator";

module("util - QueryStringCreator");

test("#toQueryString", function() {
  var subject = QueryStringCreator.create();
  var result = subject.toQueryString({
    type: "credit",
    "today[>]": new Date('05 October 2011 14:48 UTC'),
    state: ["success", "failed"]
  });

  deepEqual(result, "type=credit&today%5B%3E%5D=2011-10-05T14%3A48%3A00.000Z&state%5Bin%5D=success%2Cfailed");
});

test("#toQueryStringPair", function() {
  var today = new Date('05 October 2011 14:48 UTC');
  today.toISOString();

  var subject = QueryStringCreator.create();
  var test = function(key, value, expectation) {
    deepEqual(subject.toQueryStringPair(key, value), expectation);
  };

  test("type", "credit", "type=credit");
  test("type", ["credit"], "type=credit");
  test("type", ["credit", "debit"], "type%5Bin%5D=credit%2Cdebit");
  test("created_at[>]", today, "created_at%5B%3E%5D=2011-10-05T14%3A48%3A00.000Z");
});

test("#serializeKeyValue", function() {
  var subject = QueryStringCreator.create();

  deepEqual(subject.serializeKeyValue("type", ""), "type");
  deepEqual(subject.serializeKeyValue("type", "credit"), "type=credit");
});
