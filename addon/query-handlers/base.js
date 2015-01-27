import Ember from "ember";
import QueryStringCreator from "balanced-addon-models/utils/query-string-creator";

export default Ember.Object.extend({
  url: function(host, attributes) {
    return QueryStringCreator.uri(host, attributes);
  },
});
