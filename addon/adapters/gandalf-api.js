// import Ember from "ember";
import BalancedApiBaseAdapter from "./balanced-api-base";

var GandalfApiAdapter = BalancedApiBaseAdapter.extend({
  host: "https://gandalf.vandelay.io",
});

export default GandalfApiAdapter;
