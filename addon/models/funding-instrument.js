import Model from "./core/model";
import BK from "./core/method-generators";

var FundingInstrument = Model.extend({
  fetchCustomer: BK.fetchSingle('customer'),

  isBankAccount: false,
  isCard: false,
});

FundingInstrument.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default FundingInstrument;
