import FundingInstrument from "./funding-instrument";

var Card = FundingInstrument.extend({
  isCard: true,

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
