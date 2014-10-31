import Ember from "ember";
import JsonApiSerializer from 'ember-json-api/json_api_serializer';

export default JsonApiSerializer.extend({
  normalize: function(type, hash, prop) {
    var json = {};

    for (var key in hash) {
      if (key !== 'links') {
        json[key] = hash[key];
      }
      else if (typeof hash[key] === 'object') {
        for (var link in hash[key]) {
          var linkValue = hash[key][link];
          if (!Ember.isNone(linkValue) && typeof linkValue === 'object' && linkValue.href) {
            json.links = json.links || {};
            json.links[link] = linkValue.href;
          } else {
            json[link] = linkValue;
          }
        }
      }
    }

    return this._super(type, json, prop);
  },
});
