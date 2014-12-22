import Model from "./core/model";

var ApiKey = Model.extend({
  createUri: "/api_keys",
});

ApiKey.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api-base",
});

export default ApiKey;
