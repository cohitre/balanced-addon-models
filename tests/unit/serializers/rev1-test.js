import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@serializer:rev1", "serializer - Rev1");

test("#extractCollection", function() {
  var json = {
    "meta": {
      "last": "/marketplaces?limit=10&offset=0",
    },
    "marketplaces": [
      {
        "id": "TEST-MP11111",
        "name": "My test mp",
        "links": {
          "owner_customer": "CU11111"
        },
        "href": "/marketplaces/TEST-MP11111",
        "meta": {},
      },
      {
        "id": "TEST-MP22222",
        "name": "carlos test mp",
        "links": {
          "owner_customer": "CU22222"
        },
        "href": "/marketplaces/TEST-MP22222",
        "meta": {},
      }
    ],
    "links": {
      "marketplaces.debits": "/debits",
      "marketplaces.owner_customer": "/customers/{marketplaces.owner_customer}",
    }
  };

  var subject = this.subject();

  var result = subject.extractCollection(json);
  deepEqual(result, {
    items: [{
      "_type": "marketplace",
      "debits_uri": "/debits",
      "id": "TEST-MP11111",
      "href": "/marketplaces/TEST-MP11111",
      "name": "My test mp",
      "owner_customer_uri": "/customers/CU11111",
      "uri": "/marketplaces/TEST-MP11111",
      "meta": {},
      "links": {
        "owner_customer": "CU11111"
      },
    }, {
      "_type": "marketplace",
      "debits_uri": "/debits",
      "href": "/marketplaces/TEST-MP22222",
      "id": "TEST-MP22222",
      "name": "carlos test mp",
      "owner_customer_uri": "/customers/CU22222",
      "uri": "/marketplaces/TEST-MP22222",
      "meta": {},
      "links": {
        "owner_customer": "CU22222"
      },
    }],
    linked: undefined,
    meta: {
      last: "/marketplaces?limit=10&offset=0"
    }
  });
});

test("populateObject", function() {
  var subject = this.subject();
  var object = Ember.Object.create();

  var populatedObject = subject.populateObject(object, "marketplace", {
    "meta": {},
    "marketplaces": [
      {
        "id": "TEST-MP11111",
        "name": "My test mp",
        "links": {
          "owner_customer": "CU11111"
        },
        "href": "/marketplaces/TEST-MP11111",
        "meta": {},
      },
      {
        "id": "TEST-MP22222",
        "name": "carlos test mp",
        "links": {
          "owner_customer": "CU22222"
        },
        "href": "/marketplaces/TEST-MP22222",
        "meta": {},
      }
    ],
    "links": {
      "marketplaces.debits": "/debits",
      "marketplaces.owner_customer": "/customers/{marketplaces.owner_customer}",
    }
  });
  equal(object, populatedObject, "Object returned is original instance");
});
