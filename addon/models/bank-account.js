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
  }),

  getApiProperties: function() {
    return this.getProperties(
      "account_number",
      "account_type",
      "name",
      "routing_number",
      "address"
    );
  },

  createInstance: function() {
    var deferred = Ember.RSVP.defer();
    window.balanced.bankAccount.create(this.getApiProperties(), function(response) {
      if (Ember.isBlank(response.errors)) {
        deferred.resolve(response);
      }
      else {
        deferred.reject(response);
      }
    });
    return deferred.promise;
  },

  linkToCustomer: function(customer) {
    var self = this;
    var customerUri;
    if (Ember.typeOf(customer) === "string") {
      customerUri = customer;
    }

    return self.updateProperties({
      customer: customerUri
    });
  },
});

export default BankAccount;
