import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var BankAccountVerification = Model.extend({
  updatedAt: BK.computed.parseDate("updated_at"),
  createdAt: BK.computed.parseDate("updated_at"),

  isVerified: isStatus("verified").readOnly(),
  isFailed: isStatus("failed").readOnly(),
  isPending: isStatus("pending").readOnly(),
  isSuccess: isStatus("deposit_succeeded").readOnly(),

  attemptsRemaining: Ember.computed.reads("attempts_remaining").readOnly(),
  isVerifiable: Ember.computed.gt("attemptsRemaining", 0).readOnly(),
});

BankAccountVerification.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

function isStatus(value) {
  return Ember.computed.equal("verification_status", value);
}

export default BankAccountVerification;
