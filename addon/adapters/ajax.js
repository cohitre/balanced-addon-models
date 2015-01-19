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

    if (settings.data && method.toUpperCase() !== "GET") {
      settings.data = JSON.stringify(settings.data);
    }

    jQuery.ajax(uri, settings).then(deferred.resolve, deferred.reject);
    return deferred.promise;
  },
});

function generateAjaxMethod(method) {
  return function(path, settings) {
    return this.ajax(this._uri(path), method, settings);
  };
}

export default AjaxAdapter;
