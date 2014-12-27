import Ember from "ember";

var VALID_DATE_FORMAT = /^(\d\d?)(\s*[-\/]\s*)(\d\d\d\d)$/;
var PHONE_NUMBER_VALID_CHARACTERS = /[\d- () +]/g;

var ValidationHelpers = {
  VALID_DATE_FORMAT: VALID_DATE_FORMAT,
  validatePhoneFormat: function (number, condition) {
    if (!condition) {
      return;
    }
    number = number || "";
    if (!Ember.isBlank(number.replace(PHONE_NUMBER_VALID_CHARACTERS, ""))) {
      return 'has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)';
    }
  },
  validateDateFormat: function(date, condition) {
    if (!condition) {
      return;
    }

    var MONTHS, match, month, year;
    date = date || "";
    MONTHS = Ember.A([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    match = date.match(VALID_DATE_FORMAT);
    if (Ember.isBlank(match)) {
      return "invalid date format";
    }
    else {
      year = parseInt(match[3]);
      month = parseInt(match[1]);
      var CURRENT_YEAR = new Date().getFullYear();

      if (!(1800 < year && year <= CURRENT_YEAR)) {
        return "invalid year " + year;
      }
      if (!MONTHS.contains(month)) {
        return "invalid month " + month;
      }
    }
  }

};

export default ValidationHelpers;
