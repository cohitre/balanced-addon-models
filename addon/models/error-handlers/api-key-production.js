import Ember from "ember";
import BaseErrorHandler from "./base";

var ApiKeyProductionErrorHandler = BaseErrorHandler.extend({
  populateFromResponse: function(response) {
    response = response.responseJSON || response;

    if (!Ember.isBlank(response.description)) {
      this.addRootError(response.description);
    }
    else {
      return this._super(response);
    }
  }
});

export default ApiKeyProductionErrorHandler;
