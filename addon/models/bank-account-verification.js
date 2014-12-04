import Model from "./core/model";

var BankAccountVerification = Model.extend({
});

BankAccountVerification.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default BankAccountVerification;
