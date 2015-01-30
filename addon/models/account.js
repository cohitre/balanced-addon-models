// import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var Account = Model.extend({
  balance: BK.attrNumber("balance").readOnly(),
  balanceDollars: BK.attrCentsToDollars("balance").readOnly(),
  isCreditable: BK.attrBoolean("can_credit").readOnly(),
  isDebitable: BK.attrBoolean("can_debit").readOnly(),

  currencyType: BK.attr("currency").readOnly(),
  type: BK.attr("type").readOnly(),
});

Account.reopenClass({
  API_PROPERTIES: ["meta"],
});

export default Account;
