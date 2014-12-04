import Ember from "ember";
import Model from "./core/model";

var Log = Model.extend({
  isStatusSucceeded: Ember.computed.equal("status_rollup", "2XX").readOnly(),
  isStatusFailed: Ember.computed("status_rollup", function() {
    var statusCode = this.get('status_rollup');
    return statusCode === "3XX" || statusCode === "4XX" || statusCode === "5XX";
  }).readOnly(),
});

Log.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api",
});

export default Log;
