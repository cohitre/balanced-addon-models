import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:api-key", "model - ApiKey");

test("#adapter", MH.shouldUseBalancedApiAdapter("balanced-addon-models@adapter:balanced-api"));
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("properties", function() {
  var s = this.subject();
  s.ingestJsonItem({
    "created_at": "2015-01-12T22:42:19.063362Z",
    "href": "/api_keys/AKxxxxxxxxxxxxx",
    "id": "AKxxxxxxxxxxxxx",
    "links": {},
    "meta": {}
  });

  MH.shouldMatch(s, {
    meta: {},
    secret: null
  });

  s.ingestJsonItem({
    "created_at": "2015-01-12T22:42:19.063362Z",
    "href": "/api_keys/AKxxxxxxxxxxxxx",
    "id": "AKxxxxxxxxxxxxx",
    "links": {},
    "secret": "ak-test-xxxxxxxxxxxxxxxxxxxxxxxxx",
    "meta": {}
  });

  MH.shouldMatch(s, {
    meta: {},
    secret: "ak-test-xxxxxxxxxxxxxxxxxxxxxxxxx"
  });
});
