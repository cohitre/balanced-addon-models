import Model from "./core/model";

var Order = Model.extend({
});

Order.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Order;
