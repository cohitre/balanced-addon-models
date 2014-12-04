import Ember from "ember";

var ModelHelpers = {
  shouldUseBalancedApiAdapter: function(expectation) {
    expectation = expectation || "balanced-addon-models@adapter:balanced-api";
    return function() {
      var adapterName = this.subject().constructor.adapterName;
      deepEqual(adapterName, expectation);
    };
  }
};

export default ModelHelpers;
