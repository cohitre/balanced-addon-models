import Ember from "ember";
import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";

var BankAccount = FundingInstrument.extend({
  isBankAccount: Ember.computed(function() {
    return true;
  }).readOnly(),

  name: BK.attr("name"),
  routingNumber: BK.attr("routing_number"),
  bankName: BK.attr("bank_name").readOnly(),
  accountType: BK.attr("account_type"),

  isChecking: Ember.computed.equal("accountType", "checking").readOnly(),
  isSavings: Ember.computed.equal("accountType", "savings").readOnly(),

  isRemoved: BK.computed.readOnly("canCredit"),

  number: BK.attr("account_number"),

  getBalancedJsModel: function() {
    return window.balanced.bankAccount;
  },
});

BankAccount.reopenClass({
  API_PROPERTIES: ["account_number", "account_type", "name", "routing_number", "account_type", "address", "meta"],
});

export default BankAccount;
