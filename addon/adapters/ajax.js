import Ember from "ember";
import BaseAdapter from "./base";
var jQuery = window.jQuery;

var AjaxAdapter = BaseAdapter.extend({
  _uri: function(path) {
    return this.host + path;
  },

	fetch: generateAjaxMethod("GET"),
	post: generateAjaxMethod("POST"),
	update: generateAjaxMethod("PUT"),
	del: generateAjaxMethod("DELETE"),

  getSerializer: function() {
    return this.container.lookup(this.get("serializerName"));
  },

  ajax: function(uri, method, settings) {
    var deferred = Ember.RSVP.defer();
    settings = Ember.merge({
      contentType: this.get("contentType"),
      context: this,
      accepts: this.get("accepts"),
      dataType: "json",
      method: method,
      headers: this.get("headers")
    }, settings);

    jQuery.ajax(uri, settings).then(deferred.resolve, deferred.reject);
    return deferred.promise;
  },
});

function generateAjaxMethod(method) {
  return function(path, settings) {
    var serializer = this.getSerializer();
    return this.ajax(this._uri(path), method, settings)
      .then(function(response) {
        return serializer.extractCollection(response);
      });
  };
}

export default AjaxAdapter;
