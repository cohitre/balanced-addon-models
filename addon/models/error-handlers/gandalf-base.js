import Ember from "ember";
import BaseErrorHandler from "./base";

var GandalfBase = BaseErrorHandler.extend({
  populateFromResponse: function(response) {
    if (response.responseJSON) {
      this.handleApiResponse(response.responseJSON);
    }
    else if (response.statusText === "error") {
      this.handleUnknownError();
    }
  },

  handleApiResponse: function(errors) {
    var self = this;

    var loopBody = function(attributeName) {
      return function(message) {
        self.addErrorToField(attributeName, message);
      };
    };

    for (var fieldName in errors) {
      Ember.A(errors[fieldName]).forEach(loopBody(fieldName));
    }
  }
});

export default GandalfBase;
