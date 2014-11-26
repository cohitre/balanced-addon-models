import Model from "./core/model";
import BK from "./core/method-generators";

var BankAccountVerification = Model.extend({
});

BankAccountVerification.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default BankAccountVerification;
