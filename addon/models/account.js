// import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var Account = Model.extend({
  balance: BK.attrNumber("balance").readOnly(),
  balanceDollars: BK.attrCentsToDollars("balance").readOnly(),
  isCreditable: BK.attrBoolean("can_credit").readOnly(),
  isDebitable: BK.attrBoolean("can_debit").readOnly(),

  currencyType: BK.attr("currency").readOnly(),
  meta: BK.attr("meta"),
  type: BK.attr("type").readOnly(),

  getApiProperties: function() {
    return this.getProperties("meta");
  },
});

Account.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api",
});

export default Account;
