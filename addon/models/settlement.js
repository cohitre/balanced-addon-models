// import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var Settlement = Model.extend({
  updatedAt: BK.computed.parseDate("updated_at").readOnly(),
  createdAt: BK.computed.parseDate("updated_at").readOnly(),
});

Settlement.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api",
});

export default Settlement;
