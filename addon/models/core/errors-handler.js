import Ember from "ember";

var addErrorToField = function(model, fieldName, errorMessage) {
  var errors = model.get("errors");
  errors.get(fieldName).pushObject(errorMessage);
};

var addRootError = function(model, errorMessage) {
  addErrorToField(model, "_root", errorMessage);
};

var cleanDescription = function(description) {
  if (description.indexOf(" - ") > 0) {
    return description.split(" - ")[1];
  }
  else {
    return description;
  }
};

var ErrorsHandler = {
  handleApiResponse: function(model, errors) {
    var hasValidationError = false;
    Ember.A(errors).forEach(function(error) {
      if (error.extras) {
        hasValidationError = true;
        for (var fieldName in error.extras) {
          addErrorToField(model, fieldName, error.extras[fieldName]);
        }
      }
      else if (!Ember.isBlank(error.description)) {
        addRootError(model, cleanDescription(error.description));
      }
      else {
        addRootError(model, error[0]);
      }
    });
    if (hasValidationError) {
      addRootError(model, "There was a validation error when submitting your request.");
    }
  },

  handleUnknownError: function(model) {
    addRootError(model, "There was an error processing your request.");
  },

  handle: function(model, response) {
    if (response.responseJSON) {
      this.handleApiResponse(model, response.responseJSON.errors);
    }
    else if (response.statusText === "error") {
      this.handleUnknownError(model, response);
    }
  }
};

export default ErrorsHandler;
