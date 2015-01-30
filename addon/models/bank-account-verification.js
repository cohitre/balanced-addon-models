import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var BankAccountVerification = Model.extend({
  verificationStatus: BK.attr("verification_status").readOnly(),
  depositStatus: BK.attr("deposit_status").readOnly(),
  attemptsRemaining: Ember.computed.reads("__attributes.attempts_remaining").readOnly(),
  isVerifiable: Ember.computed.gt("attemptsRemaining", 0).readOnly(),

  isVerified: Ember.computed.equal("verificationStatus", "verified"),
  isFailed: Ember.computed.equal("verificationStatus", "failed"),
  isPending: Ember.computed.equal("verificationStatus", "pending"),

  isDepositSuccess: Ember.computed.equal("depositStatus", "succeeded"),

  verify: function(amount1, amount2) {
    return this.updateProperties({
      amount_1: amount1,
      amount_2: amount2
    });
  },
});

BankAccountVerification.reopenClass({
  API_PROPERTIES: ["meta", "amount_1", "amount_2"],
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default BankAccountVerification;
