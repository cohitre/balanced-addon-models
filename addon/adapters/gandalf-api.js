// import Ember from "ember";
import AjaxAdapter from "./ajax";

var GandalfApiAdapter = AjaxAdapter.extend({
  serializerName: "balanced-addon-models@serializer:rev1",

  host: "http://localhost:8111",
  accepts: {
    json: "application/vnd.api+json;revision=1.1",
  },
  contentType: 'application/json; charset=UTF-8',
});

export default GandalfApiAdapter;
