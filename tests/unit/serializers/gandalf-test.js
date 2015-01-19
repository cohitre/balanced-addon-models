import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@serializer:gandalf", "serializer - Gandalf");

test("#extractCollection", function() {
  var RESPONSE = [{
    id: 10000,
    created_at:"2014-12-10T02:15:10.179567Z",
    merchant_uri:"/v1/marketplaces/MR",
  }];

  var s = this.subject();
  deepEqual(s.extractCollection(RESPONSE), {
    items: [{
      id: 10000,
      uri: undefined,
      _type: "marketplace-application",
      created_at:"2014-12-10T02:15:10.179567Z",
      merchant_uri:"/v1/marketplaces/MR",
    }],
    linked: {},
    meta: {}
  });
});

test("#extractSingle", function() {
  var RESPONSE = {
    id: 10000,
    created_at:"2014-12-10T02:15:10.179567Z",
    merchant_uri:"/v1/marketplaces/MR",
  };

  var s = this.subject();
  deepEqual(s.extractSingle(RESPONSE), {
    id: 10000,
    created_at:"2014-12-10T02:15:10.179567Z",
    merchant_uri:"/v1/marketplaces/MR",
  });
});
