import Ember from "ember";

var ModelHelpers = {
  shouldRead: function(readerName, attributeName) {
    return function() {
      var s = this.subject();
      s.set(attributeName, "xxxxxxxxxxxx");
      deepEqual(s.get(readerName), "xxxxxxxxxxxx");
    };
  },
  shouldUseBalancedApiAdapter: function(expectation) {
    expectation = expectation || "balanced-addon-models@adapter:balanced-api";
    return function() {
      var adapterName = this.subject().constructor.adapterName;
      deepEqual(adapterName, expectation);
    };
  },
  shouldUseBalancedApiSerializer: function(expectation) {
    expectation = expectation || "balanced-addon-models@serializer:rev1";
    return function() {
      var adapterName = this.subject().constructor.serializerName;
      deepEqual(adapterName, expectation);
    };
  },

  shouldHaveAmountValidations: function(fieldName) {
    fieldName = fieldName || "amount";
    return function() {
      var s = this.subject();
      var t = function(value, expectation) {
        s.set("amount", value);
        deepEqual(s.get("errors.amount"), expectation);
      };

      t("0", ["must be greater than 0"], 'Amount is "0"');
      t("-10.40", ["must be an integer"], 'Amount is "-10.40"');
      t(-10, ["must be greater than 0"], "Amount is -10");
      t(null, ["can't be blank", "is not a number"], "Amount is null");
      t(10, [], "Amount is valid");
    };
  },

  generateErrorTester: function(subject, fieldName) {
    return function(value, expectation, message) {
      subject.set(fieldName, value);
      deepEqual(subject.get("errors." + fieldName), expectation, message);
    };
  },

  shouldMatch: function(subject, properties) {
    for (var key in properties) {
      deepEqual(subject.get(key), properties[key], "subject#" + key);
    }
  }
};

export default ModelHelpers;
