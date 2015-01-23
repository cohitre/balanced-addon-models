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
    var MH = this;
    fieldName = fieldName || "amount";
    return function() {
      var s = this.subject();
      var t = MH.generateErrorTester(s, fieldName);

      t(null, [ "can't be blank", "is not a number"]);
      t(10, []);
      t(-100, ["must be greater than or equal to 0"]);
      t(10.20, ["must be an integer"]);
    };
  },

  generateErrorTester: function(subject, fieldName) {
    return function(value, expectation) {
      subject.set(fieldName, value);
      deepEqual(subject.get("errors." + fieldName), expectation);
    };
  },

  shouldMatch: function(subject, properties) {
    for (var key in properties) {
      deepEqual(subject.get(key), properties[key], "subject#" + key);
    }
  }
};

export default ModelHelpers;
