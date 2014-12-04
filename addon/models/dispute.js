import Model from "./core/model";

var Dispute = Model.extend({
});

Dispute.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Dispute;
