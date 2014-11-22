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
        "id": "TEST-MP6OlNbMkUbLTMT6pM4H3eLj",
        "name": "carlos test mp",
        "links": {
          "owner_customer": "CU6Onsf5OkhscYPT3qS5PwAl"
        },
        "href": "/marketplaces/TEST-MP6OlNbMkUbLTMT6pM4H3eLj",
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
      "href": "/marketplaces/TEST-MP6OlNbMkUbLTMT6pM4H3eLj",
      "id": "TEST-MP6OlNbMkUbLTMT6pM4H3eLj",
      "links": {
        "owner_customer": "CU6Onsf5OkhscYPT3qS5PwAl"
      },
      "meta": {},
      "name": "carlos test mp",
      "owner_customer_uri": "/customers/CU6Onsf5OkhscYPT3qS5PwAl",
      "uri": "/marketplaces/TEST-MP6OlNbMkUbLTMT6pM4H3eLj"
    }],
    linked: undefined,
    meta: {
      last: "/marketplaces?limit=10&offset=0"
    }
  });
});

test("#extractSingle", function() {
  var subject = this.subject();
  var links = {
    "debits": "/debits",
    "marketplaces.transactions": "/marketplaces/{marketplaces.id}/transactions",
    "marketplaces.owner_customer": "/marketplaces/{marketplaces.id}/customers/{marketplaces.owner_customer}"
  };
  var marketplace = {
    id: "MPxxxxx",
    links: {
      owner_customer: "CUxxxxx"
    }
  };

  var result = subject.compileModelLinks("marketplaces", marketplace, links);
  deepEqual(result, {
    owner_customer: {
      href: "/marketplaces/MPxxxxx/customers/CUxxxxx"
    },
    transactions: {
      href: "/marketplaces/MPxxxxx/transactions"
    }
  });
});
