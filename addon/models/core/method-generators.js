import Ember from "ember";

var MethodGenerators = {
  fetchCollectionForUri: function(typeName, uri, defaultAttributes) {
    return function(attributes) {
      attributes = compileAttributes(this, defaultAttributes, attributes);
      return fetch(this.store, "fetchCollection", typeName, uri, attributes);
    };
  },

  fetchCollection: function(typeName, uriProperty, defaultAttributes) {
    uriProperty = uriProperty || typeName + "s_uri";
    return function(attributes) {
      attributes = compileAttributes(this, defaultAttributes, attributes);
      return fetch(this.store, "fetchCollection", typeName, this.get(uriProperty), attributes);
    };
  },

  fetchSingle: function(typeName, uriProperty, defaultAttributes) {
    uriProperty = uriProperty || typeName + "_uri";
    return function(attributes) {
      attributes = compileAttributes(this, defaultAttributes, attributes);
      return fetch(this.store, "fetchItem", typeName, this.get(uriProperty), attributes);
    };
  },
};

function fetch(store, methodName, typeName, uri, attributes) {
  if (Ember.isBlank(uri)) {
    return Ember.RSVP.resolve(null);
  } else {
    return store[methodName](typeName, uri, attributes);
  }
}

function compileAttributes(object, defaultAttributes, attributes) {
  var compiledAttributes = {};
  compiledAttributes = Ember.merge(compiledAttributes, defaultAttributes);
  compiledAttributes = Ember.merge(compiledAttributes, attributes);

    for (var attributeName in compiledAttributes) {
      if (Ember.typeOf(compiledAttributes[attributeName]) === "function") {
        compiledAttributes[attributeName] = compiledAttributes[attributeName].call(object);
      }
    }
  return compiledAttributes;
}

export default MethodGenerators;
