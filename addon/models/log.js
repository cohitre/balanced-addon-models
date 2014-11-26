import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var Log = Model.extend({});

Log.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api",
});

export default Log;
