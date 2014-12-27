// import Ember from "ember";
import BalancedApiBaseAdapter from "./balanced-api-base";

var GandalfApiAdapter = BalancedApiBaseAdapter.extend({
  host: "http://localhost:8111",
});

export default GandalfApiAdapter;
