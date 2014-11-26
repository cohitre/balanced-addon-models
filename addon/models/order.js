import Model from "./core/model";
import BK from "./core/method-generators";

var Order = Model.extend({
});

Order.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Order;
