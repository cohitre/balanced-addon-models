import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var BankAccountVerification = Model.extend({
  meta: BK.attr("meta"),

  isVerified: isStatus("verified"),
  isFailed: isStatus("failed"),
  isPending: isStatus("pending"),
  isSuccess: isStatus("deposit_succeeded"),

  attemptsRemaining: Ember.computed.reads("__attributes.attempts_remaining").readOnly(),
  isVerifiable: Ember.computed.gt("attemptsRemaining", 0).readOnly(),

  verify: function(amount1, amount2) {
    return this.updateProperties({
      amount_1: amount1,
      amount_2: amount2
    });
  },
});

BankAccountVerification.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

function isStatus(value) {
  var attrName = "__attributes.verification_status";
  return Ember.computed.equal(attrName, value).readOnly();
}

export default BankAccountVerification;
