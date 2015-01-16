import Ember from "ember";

var QueryStringCreator = Ember.Object.extend({
  toQueryString: function(object) {
    var pairs = [];
    for (var key in object) {
      pairs.push(this.toQueryStringPair(key, object[key]));
    }
    return pairs.join("&");
  },

  toQueryStringPair: function(key, value) {
    if (Ember.isBlank(value)) {
      return this.serializeKeyValue(key, value);
    }
    else if (Ember.isArray(value)) {
      if (value.length === 1) {
        return this.serializeKeyValue(key, value[0]);
      }
      else {
        return this.serializeKeyValue(key + "[in]", value.join(","));
      }
    }
    else if (value.toISOString) {
      return this.serializeKeyValue(key, value.toISOString());
    }
    else {
      return this.serializeKeyValue(key, value);
    }
  },

  serializeKeyValue: function(key, value) {
    if (Ember.isBlank(value)) {
      return encodeURIComponent(key);
    }
    else {
      return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }
  },
});

QueryStringCreator.reopenClass({
  uri: function(uri, queryStringObject) {
    var creator = this.create();
    if (Ember.isBlank(queryStringObject)) {
      return uri;
    }
    else {
      return uri + "?" + creator.toQueryString(queryStringObject);
    }
  },
});

export default QueryStringCreator;
