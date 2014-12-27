import Model from "./core/model";
import BK from "./core/method-generators";

var FundingInstrument = Model.extend({
  fetchCustomer: BK.fetchSingle('customer'),

  isBankAccount: false,
  isCard: false,
});

export default FundingInstrument;
