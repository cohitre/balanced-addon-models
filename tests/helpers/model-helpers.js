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
  }
};

export default ModelHelpers;
