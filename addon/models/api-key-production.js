import Ember from "ember";
import EmberValidations from "ember-validations";
import ApiKey from "./api-key";
import ApiKeyProductionErrorsHandler from "./error-handlers/api-key-production";
import ApiKeyMerchantPropertiesCreator from "./support/api-key-merchant-properties-creator";

var VALID_DATE_FORMAT = /^(\d\d?)(\s*[-\/]\s*)(\d\d\d\d)$/;
var VALID_TYPE_VALUES = ["business", "person"];
var PHONE_NUMBER_VALID_CHARACTERS = /[\d- () +]/g;

var ApiKeyProduction = ApiKey.extend({
  validations: {
    type: {
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
      length: {
        minimum: 4,
        "if": "isBusiness"
      }
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
          return validateDateFormat(this.get("businessIncorporationDate"));
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
        return validateDateFormat(this.get("personDateOfBirth"));
      })
    },
    personPhoneNumber: {
      presence: {
        "if": "isPerson"
      },
      length: {
        maximum: 15
      },
      inline: EmberValidations.validator(function() {
        if (this.get("isPerson")) {
          return validatePhoneFormat(this.get("personPhoneNumber"));
        }
      })
    }
  },

  getErrorsHandler: function() {
    return ApiKeyProductionErrorsHandler.create({
      model: this
    });
  },
  type: "person",

  isPerson: Ember.computed.equal("type", "person").readOnly(),
  isBusiness: Ember.computed.equal("type", "business").readOnly(),

  marketplaceCategory: "crowdfunding",

  businessType: Ember.computed(function(attr, value) {
    if (arguments.length > 1) {
      if (value === "person") {
        this.set("type", "person");
      }
      else {
        this.set("type", "business");
      }
    }
    return value;
  }),

  getApiProperties: function() {
    return getApiKeyPropertiesCreator(this).getApiProperties();
  },

  formattedIncorporationDate: generateFormattedDate("businessIncorporationDate"),
  formattedPersonDateOfBirth: generateFormattedDate("personDateOfBirth")
});

function generateFormattedDate(propName) {
  return Ember.computed(propName, function() {
    var date = this.get(propName);
    if (Ember.typeOf(date) === "string") {
      var match = date.match(VALID_DATE_FORMAT);
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

function validateDateFormat(date) {
  var MONTHS, match, month, year;
  date = date || "";
  MONTHS = Ember.A([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  match = date.match(VALID_DATE_FORMAT);
  if (Ember.isBlank(match)) {
    return "invalid date format";
  }
  else {
    year = parseInt(match[3]);
    month = parseInt(match[1]);
    var CURRENT_YEAR = new Date().getFullYear();

    if (!(1800 < year && year <= CURRENT_YEAR)) {
      return "invalid year " + year;
    }
    if (!MONTHS.contains(month)) {
      return "invalid month " + month;
    }
  }
}

function validatePhoneFormat(number) {
  number = number || "";
  if (!Ember.isBlank(number.replace(PHONE_NUMBER_VALID_CHARACTERS, ""))) {
    return 'has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)';
  }
}

export default ApiKeyProduction;
