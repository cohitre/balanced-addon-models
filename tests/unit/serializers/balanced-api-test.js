import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import DS from "ember-data";

moduleFor("balanced-addon-models@serializer:balanced-api", "serializer - BalancedApiSerializer", {
  setup: function() {
    DS._routes = {};
  }
});

test("#extractLinks", function() {
  var subject = this.subject();
  var result = subject.extractLinks({
    "customer.debits": "/customers/{customer.id}/debits",
    "debits": "/debits"
  });

  deepEqual(DS._routes, {
    "customer.debits": "/customers/{customer.id}/debits",
    "debits": "/debits"
  });

  deepEqual(result, [{
    "customer.debits": "/customers/{customer.id}/debits"
  }, {
    "debits": "/debits"
  }]);
});

test("#normalize", function() {
  DS._routes = {
    "authors.books": "/authors/{author.id}/books"
  };
  var Author = {
    eachAttribute: function() {},
    eachTransformedAttribute: function() {},
    eachRelationship: function(callback, self) {
      callback.call(self, "books", {
        kind: "hasMany"
      });
    }
  };

  var subject = this.subject();
  var executeTest = function(data, expectation) {
    var result = subject.normalize(Author, data, "authors");
    deepEqual(result, expectation);
  }.bind(this);

  executeTest({
    id: "CU123123123",
    links: {},
    address: {
      city: "Metroville"
    }
  }, {
    id: "CU123123123",
    address: {
      city: "Metroville"
    },
    links: {
      "books": "/authors/CU123123123/books"
    }
  });
});
