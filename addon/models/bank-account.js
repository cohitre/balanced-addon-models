import Ember from "ember";
import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";

var BankAccount = FundingInstrument.extend({
  isBankAccount: true,

  isRemoved: BK.computed.readOnly("canCredit"),
  canDebit: BK.computed.readOnly("can_debit"),
  canCredit: BK.computed.readOnly("can_credit"),

  hasCustomer: Ember.computed.notEmpty("customer_uri").readOnly(),
  hasVerification: Ember.computed.notEmpty("verification_uri").readOnly(),
  isVerifiable: Ember.computed.reads("hasCustomer").readOnly(),

  fetchVerifications: BK.fetchCollection("bank_account_verification"),
  fetchVerification: BK.fetchSingle("bank_account_verification"),

  verification: BK.computed.single("bank_account_verification"),

  lastFour: Ember.computed("account_number", function() {
    var num = this.get("account_number");
    if (Ember.typeOf(num) === "string") {
      return num.substr(num.length - 4, 4);
    }
    else {
      return null;
    }
  }).readOnly(),

  getApiProperties: function() {
    return this.getProperties(
      "account_number",
      "account_type",
      "name",
      "routing_number",
      "address"
    );
  },

  getBalancedJsModel: function() {
    return window.balanced.bankAccount;
  },
});

export default BankAccount;
