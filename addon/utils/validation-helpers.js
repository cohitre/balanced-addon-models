import Ember from "ember";

var VALID_DATE_FORMAT = /^(\d\d?)(\s*[-\/]\s*)(\d\d\d\d)$/;
var INVALID_APPEARS_ON_STATEMENT_AS_CHARACTERS = /[^\w.<>(){}\[\]+&!$*;\-%_?:#@~=\'" ^\\`|]/;
var PHONE_NUMBER_INVALID_CHARACTERS = /[^\d- () +]/g;

var ValidationHelpers = {
  VALID_DATE_FORMAT: VALID_DATE_FORMAT,

  validateAppearsOnStatementAsFormat: function(string) {
    var match = (string||"").match(INVALID_APPEARS_ON_STATEMENT_AS_CHARACTERS);
    if (match) {
      return 'has invalid character "' + match[0] + '"';
    }
  },

  validateAppearsOnStatementAsLength: function(string, length) {
    return string + length;
  },

  validatePhoneFormat: function (number) {
    var match = (number||"").match(PHONE_NUMBER_INVALID_CHARACTERS);
    if (match) {
      return 'has invalid character "' + match[0] + '" (only "+", "-", "(", ")" spaces and numbers are accepted)';
    }
  },

  validateDateFormat: function(date) {
    var match, month, year;
    date = date || "";
    match = date.match(VALID_DATE_FORMAT);
    if (Ember.isBlank(match)) {
      return "invalid date format";
    }
    else {
      year = parseInt(match[3]);
      month = parseInt(match[1]);

      if (!isValidYear(year)) {
        return "invalid year " + year;
      }
      if (!isValidMonth(month)) {
        return "invalid month " + month;
      }
    }
  }
};

function isValidMonth(month) {
  return isBetween(month, 0, 12);
}

function isValidYear(year) {
  return isBetween(year, 1800, new Date().getFullYear());
}

function isBetween(num, start, end) {
  return start < num && num <= end;
}

export default ValidationHelpers;
