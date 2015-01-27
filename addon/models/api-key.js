import Model from "./core/model";
import BK from "./core/method-generators";

var ApiKey = Model.extend({
  createUri: "/api_keys",
  secret: BK.attr("secret").readOnly(),
  meta: BK.attr("meta"),
});

ApiKey.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api",
});

export default ApiKey;
