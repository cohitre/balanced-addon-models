import Ember from "ember";
import EmberValidations from "ember-validations";
import ApiKey from "./api-key";
import ApiKeyProductionErrorsHandler from "./error-handlers/api-key-production";
import ApiKeyMerchantPropertiesCreator from "./support/api-key-merchant-properties-creator";
import VH from "../utils/validation-helpers";

var VALID_TYPE_VALUES = ["llc", "scorp", "ccorp", "partnership", "sole_proprietorship", "person"];

var ApiKeyProduction = ApiKey.extend({
  validations: {
    businessType: {
      presence: true,
      inclusion: {
        "in": VALID_TYPE_VALUES
      }
    },
    businessName: {
      presence: {
        "if": "isBusiness"
      }
    },
    businessTaxId: {
      presence: {
        "if": "isBusiness"
      },
      format: {
        "with": /^\d\d-\d{7}$/,
        message: "must match format 12-1234567",
        "if": "isBusiness"
      }
    },
    businessPhoneNumber: {
      presence: {
        "if": "isBusiness"
      },
      length: {
        maximum: 15,
        "if": "isBusiness"
      },
      inline: EmberValidations.validator(function() {
        if (this.get("isBusiness")) {
          return VH.validatePhoneFormat(this.get("businessPhoneNumber"));
        }
      })
    },
    businessAddressLine1: {
      presence: {
        "if": "isBusiness"
      }
    },
    businessIncorporationDate: {
      presence: {
        "if": "isBusiness"
      },
      inline: EmberValidations.validator(function() {
        if (this.get("isBusiness")) {
          return VH.validateDateFormat(this.get("businessIncorporationDate"));
        }
      })
    },
    personFullName: {
      presence: true
    },
    personSsnLast4: {
      presence: true,
      length: 4,
      format: {
        "with": /^\d\d\d\d$/,
        message: 'must be digits only'
      }
    },
    personDateOfBirth: {
      presence: true,
      inline: EmberValidations.validator(function() {
        return VH.validateDateFormat(this.get("personDateOfBirth"));
      })
    },
    personPhoneNumber: {
      presence: {
        "if": "isPerson"
      },
      length: {
        maximum: 15,
        "if": "isPerson"
      },
      inline: EmberValidations.validator(function() {
        return VH.validatePhoneFormat(this.get("personPhoneNumber"));
      })
    }
  },

  getErrorsHandler: function() {
    return ApiKeyProductionErrorsHandler.create({
      model: this
    });
  },

  isPerson: Ember.computed.equal("type", "person").readOnly(),
  isBusiness: Ember.computed.equal("type", "business").readOnly(),

  type: Ember.computed("businessType", function() {
    return (this.get("businessType") === "person") ?
      "person" :
      "business";
  }).readOnly(),
  marketplaceCategory: "crowdfunding",
  businessType: "llc",

  getApiProperties: function() {
    return getApiKeyPropertiesCreator(this).getApiProperties();
  },

  getDebuggingProperties: function() {
    return this.getProperties(
      "id",
      "isPerson",
      "isBusiness",
      "marketplaceCategory",
      "type",
      "businessIncorporationDate",
      "personDateOfBirth",

      "businessName",
      "businessAddressLine1",
      "businessAddressPostalCode",
      "businessPhoneNumber",
      "formattedIncorporationDate",

      "personFullName",
      "formattedPersonDateOfBirth",
      "personAddressPostalCode",
      "personPhoneNumber"
    );
  },

  formattedIncorporationDate: generateFormattedDate("businessIncorporationDate"),
  formattedPersonDateOfBirth: generateFormattedDate("personDateOfBirth"),

  isProduction: true,
});

function generateFormattedDate(propName) {
  return Ember.computed(propName, function() {
    var date = this.get(propName);
    if (Ember.typeOf(date) === "string") {
      var match = date.match(VH.VALID_DATE_FORMAT);
      if (match) {
      var year = parseInt(match[3]);
      var month = parseInt(match[1]);
      return month < 10 ?
        ("" + year + "-0" + month) :
        ("" + year + "-" + month);
      }
    }
    return null;
  });
}

function getApiKeyPropertiesCreator(model) {
  return ApiKeyMerchantPropertiesCreator.create({
    model: model
  });
}

export default ApiKeyProduction;
