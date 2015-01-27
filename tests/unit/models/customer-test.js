import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:customer", "model - Customer");

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());

test("ingestJsonItem", function() {
  var deserializedResponse = {
    "name": "Mr. Customer",
    "updated_at":"2015-01-02T19:28:37.964064Z",
    "created_at":"2014-12-12T23:54:07.580383Z",
    "dob_month":1,
    "id":"CUxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "phone":null,
    "href":"/customers/CUxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "merchant_status":"no-match",
    "meta":{},
    "dob_year":2014,
    "address":{
      "city":null,
      "line2":null,
      "line1":null,
      "state":null,
      "postal_code":null,
      "country_code":null
    },
    "business_name":null,
    "ssn_last4":null,
    "email":"cool@example.com",
    "ein":null,
    "destination_uri":null,
  };

  var s = this.subject();
  s.ingestJsonItem(deserializedResponse);
  MH.shouldMatch(s, {
    "name": "Mr. Customer",
    "updatedAt": new Date("2015-01-02T19:28:37.964064Z"),
    "createdAt": new Date("2014-12-12T23:54:07.580383Z"),
    "dateOfBirthMonth": 1,
    "dateOfBirthYear": 2014,
    "dateOfBirth": new Date("2014-01-31T23:59:59.99999Z"),
    "id": "CUxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "phone": null,
    "href": "/customers/CUxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "merchantStatus": "no-match",
    "meta": {},
    "businessName": null,
    "socialSecurityNumberLast4": null,
    "employerIdentificationNumber": null,
    "email": "cool@example.com",
    "address": {
      "city": null,
      "line2": null,
      "line1": null,
      "state": null,
      "postal_code": null,
      "country_code": null
    },
  });

});

