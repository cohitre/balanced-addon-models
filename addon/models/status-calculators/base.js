import Ember from "ember";

var BaseStatusCalculator = Ember.Object.extend({
  // Valid types [loading success info warning danger]
  alertType: "loading",
  label: "Loading",

  info: function (value, label) {
    return this.setProperties({
      alertType: "info",
      label: label || "Information",
      value: value
    });
  },

  success: function (value, label) {
    return this.setProperties({
      alertType: "success",
      label: label || "Success",
      value: value
    });
  },

  error: function (value, label) {
    return this.setProperties({
      alertType: "danger",
      label: label || "Error",
      value: value
    });
  },

  warning: function (value, label) {
    return this.setProperties({
      alertType: "warning",
      label: label || "Warning",
      value: value
    });
  },
});

export default BaseStatusCalculator;
