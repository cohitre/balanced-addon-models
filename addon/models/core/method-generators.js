import Ember from "ember";

var MethodGenerators = {
  fetchCollectionForUri: function(typeName, uri, defaultAttributes) {
    return function(attributes) {
      attributes = merge(defaultAttributes, attributes);
      return this.store.fetchCollection(typeName, uri, attributes);
    };
  },

  fetchCollection: function(typeName, uriProperty, defaultAttributes) {
    uriProperty = uriProperty || typeName + "s_uri";
    return function(attributes) {
      attributes = merge(defaultAttributes, attributes);
      return this.store.fetchCollection(typeName, this.get(uriProperty), attributes);
    };
  },

  fetchSingle: function(typeName, uriProperty, defaultAttributes) {
    uriProperty = uriProperty || typeName + "_uri";
    return function(attributes) {
      attributes = merge(defaultAttributes, attributes);
      return this.store.fetchItem(typeName, this.get(uriProperty), attributes);
    };
  },
};

function merge(defaultAttributes, attributes) {
  var a = Ember.merge({}, defaultAttributes || {});
  return Ember.merge(a, attributes || {});
}

export default MethodGenerators;
