//import Ember from "ember";
import BaseErrorHandler from "./base";

var ApiKeyProductionErrorsHandler = BaseErrorHandler.extend({
  addErrorToField: function(fieldName, errorMessage) {
    fieldName = translateFieldNameFromErrorMessage(fieldName, errorMessage);
    return this._super(fieldName, errorMessage);
  }
});

//var ERROR_FIELDS_MAPPING = {
//  "merchant[name]": "name"
//};

function translateFieldNameFromErrorMessage(fieldName, errorMessage) {
  errorMessage = errorMessage;
  return fieldName;
}

export default ApiKeyProductionErrorsHandler;
