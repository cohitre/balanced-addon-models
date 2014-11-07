import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import DS from "ember-data";

moduleFor("balanced-addon-models@serializer:balanced-api", "serializer - BalancedApiSerializer", {
  setup: function() {
    DS._routes = {};
  }
});

test("#normalizeItem", function() {
  var subject = this.subject();
  var links = {
    "marketplaces.debits": "/debits",
    "marketplaces.transactions": "/marketplaces/{marketplaces.id}/transactions",
    "marketplaces.owner_customer": "/marketplaces/{marketplaces.id}/customers/{marketplaces.owner_customer}"
  };
  var marketplace = {
    id: "MPxxxxx",
    links: {
      owner_customer: "CUxxxxx"
    }
  };
  var result = subject.normalizeItem("marketplaces", marketplace, links);
  deepEqual(result, {
    id: "MPxxxxx",
    links: {
      owner_customer: {
        href: "/marketplaces/MPxxxxx/customers/CUxxxxx"
      },
      transactions: {
        href: "/marketplaces/MPxxxxx/transactions"
      },
      debits: {
        href: "/debits"
      }
    }
  });
});

test("#compileModelLinks", function() {
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

test("#normalizePayload", function() {
  var subject = this.subject();
  var response = {
    customers: [
      {
        "name": "William Henry Cavendish III",
        "links": {
          "source": null,
          "destination": null
        },
        "id": "CUbbbbb",
      },
      {
        "name": "Harry Tan",
        "links": {
          "source": "BAaaaaa",
          "destination": null
        },
        "id": "CUaaaaa",
      },
    ],
    meta: {
      last: "/customers?sort=created_at&limit=20&offset=20",
      next: "/customers?sort=created_at&limit=20&offset=20",
      href: "/customers?sort=created_at&limit=20&offset=0",
      limit: 20,
      offset: 0,
      previous: null,
      total: 32,
      first: "/customers?sort=created_at&limit=20&offset=0"
    },
    links: {
      "customers.destination": "/resources/{customers.destination}",
      "customers.external_accounts": "/customers/{customers.id}/external_accounts",
      "customers.bank_accounts": "/customers/{customers.id}/bank_accounts",
      "customers.disputes": "/customers/{customers.id}/disputes",
      "customers.credits": "/customers/{customers.id}/credits"
    }
  };

  deepEqual(subject.normalizePayload(response, {}), {
    "customers": [
      {
        "id": "CUbbbbb",
        "name": "William Henry Cavendish III",
        "links": {
          "bank_accounts": {
            "href": "/customers/CUbbbbb/bank_accounts"
          },
          "credits": {
            "href": "/customers/CUbbbbb/credits"
          },
          "destination": {
            "href": null
          },
          "disputes": {
            "href": "/customers/CUbbbbb/disputes"
          },
          "external_accounts": {
            "href": "/customers/CUbbbbb/external_accounts"
          }
        }
      },
      {
        "id": "CUaaaaa",
        "name": "Harry Tan",
        "links": {
          "bank_accounts": {
            "href": "/customers/CUaaaaa/bank_accounts"
          },
          "credits": {
            "href": "/customers/CUaaaaa/credits"
          },
          "destination": {
            "href": null
          },
          "disputes": {
            "href": "/customers/CUaaaaa/disputes"
          },
          "external_accounts": {
            "href": "/customers/CUaaaaa/external_accounts"
          }
        },
      }
    ]
  });
});
