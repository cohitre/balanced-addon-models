import Model from "./core/model";
import BK from "./core/method-generators";

var Dispute = Model.extend({
});

Dispute.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Dispute;
