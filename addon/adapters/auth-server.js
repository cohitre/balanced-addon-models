import AjaxAdapter from "./ajax";

var AuthServerAdapter = AjaxAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev0",

  host: "https://auth.balancedpayments.com",
  accepts: 'application/vnd.balancedpayments+json; version=1.1',
  contentType: 'application/json; charset=UTF-8',
});

export default AuthServerAdapter;
