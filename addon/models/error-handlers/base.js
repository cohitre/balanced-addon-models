import Ember from "ember";

var BaseErrorsHandler = Ember.Object.extend({
  addErrorToField: function(fieldName, errorMessage) {
    var errors = this.get("model.errors");
    errors.get(fieldName).pushObject(errorMessage);
  },

  addRootError: function(errorMessage) {
    this.addErrorToField("_root", errorMessage);
  },

  handleApiResponse: function(errors) {
    var self = this;
    var hasValidationError = false;
    Ember.A(errors).forEach(function(error) {
      if (error.extras) {
        hasValidationError = true;
        for (var fieldName in error.extras) {
          self.addErrorToField(fieldName, error.extras[fieldName]);
        }
      }
      else if (!Ember.isBlank(error.description)) {
        self.addRootError(cleanDescription(error.description));
      }
      else {
        self.addRootError(error[0]);
      }
    });
    if (hasValidationError) {
      self.addRootError("There was a validation error when submitting your request.");
    }
  },

  handleUnknownError: function() {
    this.addRootError("There was an error processing your request.");
  },

  populateFromResponse: function(response) {
    if (response.responseJSON) {
      // responseJSON.errors is the json-api v1.1 default
      this.handleApiResponse(response.responseJSON.errors);
    }
    else if (response.statusText === "error") {
      this.handleUnknownError();
    }
  }
});

function cleanDescription(description) {
  if (description.indexOf(" - ") > 0) {
    return description.split(" - ")[1];
  }
  else {
    return description;
  }
}


export default BaseErrorsHandler;
