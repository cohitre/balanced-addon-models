import Ember from "ember";
import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";
import BankAccountVerificationStatus from "./status-calculators/bank-account-verification-status";

var BankAccount = FundingInstrument.extend({
  isBankAccount: true,

  isRemoved: Ember.computed.not("canCredit").readOnly(),
  fetchVerifications: BK.fetchCollection("bank_account_verification"),
  fetchVerification: BK.fetchSingle("bank_account_verification"),

  isVerifiable: Ember.computed.reads("hasCustomer").readOnly(),
  hasCustomer: Ember.computed.notEmpty("customer_uri").readOnly(),

  verificationStatus: Ember.computed("canCredit", "canDebit", function() {
    var status = BankAccountVerificationStatus.create({
      bankAccount: this
    });
    status.reload();
    return status;
  }),
});

export default BankAccount;
