// import Ember from "ember";
import BalancedApiBaseAdapter from "./balanced-api-base";

var GandalfApiAdapter = BalancedApiBaseAdapter.extend({
  host: "http://gandalf-prod-9mypyuyzhc.elasticbeanstalk.com",
});

export default GandalfApiAdapter;
