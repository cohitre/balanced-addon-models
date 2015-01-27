import Ember from "ember";
import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";

var BankAccount = FundingInstrument.extend({
  isBankAccount: true,

  name: BK.attr("name"),
  routingNumber: BK.attr("routing_number"),
  bankName: BK.attr("bank_name").readOnly(),
  accountType: BK.attr("account_type"),

  isChecking: Ember.computed.equal("accountType", "checking").readOnly(),
  isSavings: Ember.computed.equal("accountType", "savings").readOnly(),

  isRemoved: BK.computed.readOnly("canCredit"),

  number: BK.attr("account_number"),


  getApiProperties: function() {
    var self = this;
    var properties = {};
    var g = function(key, value) {
      properties[key] = self.get(value);
    };

    g("account_number", "number");
    g("account_type", "accountType");
    g("name", "name");
    g("routing_number", "routingNumber");
    g("address", "address");
    return properties;
  },

  getBalancedJsModel: function() {
    return window.balanced.bankAccount;
  },
});

export default BankAccount;
