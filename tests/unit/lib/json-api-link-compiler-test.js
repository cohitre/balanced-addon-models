import JsonApiLinkCompiler from "balanced-addon-models/lib/json-api-link-compiler";

module("lib - JsonApiLinkCompiler");

test("#resolveProperty", function() {
  var test = function(modelKey, propertyName, model, expectation) {
    var subject = new JsonApiLinkCompiler();
    var result = subject.resolveProperty(modelKey, propertyName, model);
    deepEqual(result, expectation);
  };

  var model = {
    id: "MPxxxxxxx",
    links: {
      owner_customer: "CUxxxxx"
    }
  };

  test("marketplaces", "marketplaces.owner_customer", model, "CUxxxxx");
  test("marketplaces", "marketplaces.id", model, "MPxxxxxxx");
});

test("#compile", function() {
  var subject = new JsonApiLinkCompiler("/marketplaces/{marketplaces.id}/customers/{marketplaces.owner_customer}");

  var result = subject.compile("marketplaces", {
    id: "MPxxxxxxx",
    links: {
      owner_customer: "CUxxxxx"
    }
  });

  deepEqual(result, "/marketplaces/MPxxxxxxx/customers/CUxxxxx");
});
