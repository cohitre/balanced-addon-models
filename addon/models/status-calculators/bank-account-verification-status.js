import Ember from "ember";
import Base from "./base";

var BankAccountVerificationStatus = Base.extend({
  reload: function() {
    var bankAccount = this.get("bankAccount");
    if (!bankAccount.get("canCredit")) {
      this.error("unverifiable", "Unverifiable");
    } else if (bankAccount.get("canDebit")) {
      this.success("verified", "Verified");
    }
    else if (!bankAccount.get("hasCustomer")) {
      this.error("unverifiable", "Unverifiable");
    }
    else if (bankAccount.get("hasCustomer")) {
      bankAccount.fetchVerification().then(function(verification) {
        this.forBankAccountVerification(verification);
      }.bind(this));
    }
    else {
      this.error("unknown", "Unknown verification state");
    }
    return this;
  }.observes("bankAccount", "bankAccount.canDebit", "bankAccount.hasCustomer"),

  forBankAccountVerification: function(verification) {
    if (Ember.isBlank(verification)) {
      this.warning("unverified", "Unverified");
    }
    else if (verification.get("isVerified")) {
      this.success("verified", "Verified");
    }
    else if (verification.get("isFailed")) {
      this.error("failed", "Verification failed");
    }
    else if (verification.get("isPending")) {
      this.warning("pending", "Verification pending");
    }
    else {
      this.error("unknown", "Unknown verification state");
    }
  },
});

export default BankAccountVerificationStatus;
