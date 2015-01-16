import Model from "./core/model";
import BK from "./core/method-generators";

var ApiKey = Model.extend({
  createUri: "/api_keys",

  updatedAt: BK.computed.parseDate("updated_at").readOnly(),
  createdAt: BK.computed.parseDate("updated_at").readOnly(),
});

ApiKey.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api",
});

export default ApiKey;
