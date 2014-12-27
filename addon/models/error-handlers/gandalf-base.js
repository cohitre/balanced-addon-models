import Ember from "ember";
import BaseErrorHandler from "./base";

var GandalfBase = BaseErrorHandler.extend({
  populateFromResponse: function(response) {
    if (!Ember.isBlank(response)) {
      this.handleApiResponse(response);
    }
    else {
      this.handleUnknownError();
    }
  },

  handleApiResponse: function(errors) {
    var fieldName;
    for (fieldName in errors) {
      this.addErrorsToField(fieldName, errors[fieldName]);
    }
  }
});

export default GandalfBase;
