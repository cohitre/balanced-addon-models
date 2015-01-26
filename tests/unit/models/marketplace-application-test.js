import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";
import ErrorsHandler from "balanced-addon-models/models/error-handlers/gandalf-base";

moduleFor("balanced-addon-models@model:marketplace-application", "model - MarketplaceApplication");

test("#adapter", MH.shouldUseBalancedApiAdapter("balanced-addon-models@adapter:gandalf-api"));
test("#serializer", MH.shouldUseBalancedApiSerializer("balanced-addon-models@serializer:gandalf"));

test("#href", function() {
  var s = this.subject();
  s.set("__attributes.id", "aaabbb111");
  deepEqual(s.get("href"), "/applications/aaabbb111/");
});

test("#ingestApiKey", function() {
  var s = this.subject();

  s.ingestApiKey(Ember.Object.create({
    secret: "ak-test-aaa",
    type: "LLC",
    personFullName: "Tim McCool",
    personAddressPostalCode: "11222",
  }));

  var properties = s.getProperties("api_key", "business_type", "full_name", "street_address", "postal_code");
  deepEqual(properties, {
    api_key: "ak-test-aaa",
    business_type: "LLC",
    full_name: "Tim McCool",
    street_address: "11222",
    postal_code: "11222"
  });
});

test("#ingestUser", function() {
  var s = this.subject();
  s.ingestUser(Ember.Object.create({
    email_address: "test@example.org"
  }));

  deepEqual(s.get("owner_email"), "test@example.org");
});

test("#ingestMarketplace", function() {
  var s = this.subject();
  s.ingestMarketplace(Ember.Object.create({
    href: "/marketplaces/MP123",
    name: "Cool Mp",
    supportPhoneNumber: "222-000-9999",
    supportEmailAddress: "test@example.org",
    domainUrl: "example.org"
  }));

  var properties = s.getProperties(
    "merchant_uri",
    "marketplace_name",
    "owner_phone_number",
    "support_email",
    "support_phone_number",
    "domain_url"
  );
  deepEqual(properties, {
    merchant_uri: "/marketplaces/MP123",
    marketplace_name: "Cool Mp",
    owner_phone_number: "222-000-9999",
    support_email: "test@example.org",
    support_phone_number: "222-000-9999",
    domain_url: "example.org"
  });
});

test("#getApiProperties", function() {
  var s = this.subject();
  sinon.spy(s, "getProperties");

  s.getApiProperties();
  deepEqual(s.getProperties.args, [[
      "marketplace_name",
      "business_type",
      "full_name",
      "owner_email",
      "owner_phone_number",
      "merchant_uri",
      "domain_url",
      "support_email",
      "support_phone_number",
      "postal_code",
      "street_address",
      "current_processor",
      "current_monthly_volume",
      "api_key"
  ]]);
});

test("#getDebuggingProperties", function() {
  var s = this.subject();
  sinon.spy(s, "getProperties");

  s.getDebuggingProperties();
  deepEqual(s.getProperties.args, [[
      "id",
      "marketplace_name",
      "business_type",
      "full_name",
      "owner_email",
      "owner_phone_number",
      "merchant_uri",
      "domain_url",
      "support_email",
      "support_phone_number",
      "postal_code",
      "street_address",
      "current_processor",
      "current_monthly_volume"
  ]]);
});

test("#getErrorsHandler", function() {
  var h = this.subject().getErrorsHandler();

  equal(h.constructor, ErrorsHandler);
  equal(h.model, this.subject());
});
