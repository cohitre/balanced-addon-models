import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:account", "model - Account");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("properties", function() {
  var s = this.subject();
  s.ingestJsonItem({
    "can_credit": true,
    "type": "payable",
    "created_at": "2014-12-11T22:54:46.936038Z",
    "updated_at": "2014-12-11T22:54:46.936040Z",
    "currency": "USD",
    "meta": {},
    "href": "/accounts/ATxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "balance": 1056,
    "can_debit": false,
    "id": "ATxxxxxxxxxxxxxxxxxxxxxxxxxx"
  });

  MH.shouldMatch(s, {
    balance: 1056,
    balanceDollars: 10.56,
    isCreditable: true,
    isDebitable: false,
    currencyType: "USD",
    meta: {},
    type: "payable"
  });
});
