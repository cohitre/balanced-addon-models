import Ember from "ember";
import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";

var Card = FundingInstrument.extend({
  isCard: true,

  name: BK.attr("name"),
  isExpired: Ember.computed("expirationDate", function() {
    return this.get("expirationDate") < new Date();
  }).readOnly(),

  expirationMonth: BK.attrNumber("expiration_month"),
  expirationYear: BK.attrNumber("expiration_year"),
  expirationDate: BK.attrYearMonthFields("expirationYear", "expirationMonth"),

  brand: BK.attr("brand").readOnly(),
  type: BK.attr("type").readOnly(),
  isCredit: Ember.computed.equal("type", "credit").readOnly(),
  isDebit: Ember.computed.equal("type", "debit").readOnly(),

  number: BK.attr("number"),

  cvv: BK.attr("cvv"),

  getApiProperties: function() {
    var self = this;
    var properties = {};
    var g = function(key, value) {
      properties[key] = self.get(value);
    };

    g("expiration_month", "expirationMonth");
    g("expiration_year", "expirationYear");
    g("number", "number");
    g("cvv", "cvv");
    g("name", "name");
    g("address", "address");
    return properties;
  },

  getBalancedJsModel: function() {
    return window.balanced.card;
  },
});

export default Card;
