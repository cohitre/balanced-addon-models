import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:api-key-production", "model - ApiKey");

test("#adapter", MH.shouldUseBalancedApiAdapter("balanced-addon-models@adapter:balanced-api-base"));

test("#type", function() {
  var subject = this.subject();
  deepEqual(subject.get("type"), "person");

  subject.set("type", "business");
  deepEqual(subject.get("type"), "business");

  subject.set("type", "person");
  deepEqual(subject.get("type"), "person");
});

test("#isPerson", function() {
  var subject = this.subject();
  deepEqual(subject.get("isPerson"), true);

  subject.set("type", "business");
  deepEqual(subject.get("isPerson"), false);

  subject.set("type", "person");
  deepEqual(subject.get("isPerson"), true);
});

test("#isBusiness", function() {
  var subject = this.subject();
  deepEqual(subject.get("isBusiness"), false);

  subject.set("type", "business");
  deepEqual(subject.get("isBusiness"), true);

  subject.set("type", "person");
  deepEqual(subject.get("isBusiness"), false);
});

test("#getApiProperties (person)", function() {
  var subject = this.subject();
  subject.setProperties({
    phone_number: "11111",
    person: {
      name: "Tom Person",
      ssn_last_4: "1111",
      postal_code: "99999",
    },
    business: {
      postal_code: "11222",
      name: "Important Inc."
    }
  });

  deepEqual(subject.getApiProperties(), {
    merchant: {
      production: true,
      type: "person",

      name: "Tom Person",
      phone_number: "11111",
      postal_code: "99999",
      ssn_last_4: "1111",
    }
  });
});

test("#getApiProperties (business)", function() {
  var subject = this.subject();
  subject.setProperties({
    type: "business",
    phone_number: "11111",
    incorporationDate: "12/2000",
    business: {
      name: "Business Co. Inc.",
      postal_code: "12345",
    },
    person: {
      name: "Freddy Person",
      ssn_last_4: "1111",
      postal_code: "99999",
    }
  });

  deepEqual(subject.getApiProperties(), {
    merchant: {
      name: "Business Co. Inc.",
      person: {
        name: "Freddy Person",
        ssn_last_4: "1111",
        postal_code: "99999",
      },
      incorporation_date: "2000-12",
      phone_number: "11111",
      postal_code: "12345",
      production: true,
      type: "business"
    }
  });
});
