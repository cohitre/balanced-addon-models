import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";

var Card = FundingInstrument.extend({
  isCard: true,

  name: BK.attr("name"),
  expirationMonth: BK.attr("expiration_month"),
  expirationYear: BK.attr("expiration_year"),

  number: BK.attr("number"),
  cvv: BK.attr("cvv"),
  address: BK.attr("address"),

  getApiProperties: function() {
    return this.getProperties(
      "expiration_month",
      "expiration_year",
      "number",
      "cvv",
      "name",
      "address"
    );
  },

  getBalancedJsModel: function() {
    return window.balanced.card;
  },
});

export default Card;
