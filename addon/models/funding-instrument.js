import Model from "./core/model";
import BK from "./core/method-generators";

var FundingInstrument = Model.extend({
});

FundingInstrument.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default FundingInstrument;
