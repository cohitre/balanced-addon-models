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

  propertiesGetter: function() {
    var propertyNames = arguments;
    return function() {
      return this.getProperties.apply(this, propertyNames);
    };
  },

  attr: function(fieldName) {
    var name = "__attributes." + fieldName;
    return Ember.computed.alias(name);
  },

  attrCentsToDollars: function(fieldName) {
    var name = "__attributes." + fieldName;
    return Ember.computed(name, function(attrName, value) {
      if (arguments.length > 1) {
        this.set(name, Ember.isBlank(value) ? null : (parseFloat(value, 10) * 100));
      }
      var v = this.get(name);
      return Ember.isBlank(v) ? null : (v/100);
    });
  },

  attrNumber: function(fieldName) {
    var name = "__attributes." + fieldName;
    return Ember.computed(name, function(attrName, value) {
      if (arguments.length > 1) {
        this.set(name, Ember.isBlank(value) ? null : parseFloat(value, 10));
      }
      var v = this.get(name);
      return Ember.isBlank(v) ? null : v;
    });
  },

  attrStringToDate: function(fieldName) {
    var name = "__attributes." + fieldName;
    return Ember.computed(name, function(attrName, value) {
      if (arguments.length > 1) {
        if (Ember.typeOf(value) === "date") {
          this.set(name, value.toISOString());
        }
        else {
          this.set(name, value);
        }
      }
      var v = this.get(name);
      return Ember.isBlank(v) ?
          null :
          new Date(v);
    });
  },

  computed: {
    readOnly: function(fieldName) {
      return Ember.computed.reads(fieldName).readOnly();
    },
    parseDate: function(fieldName) {
      return Ember.computed(fieldName, function() {
        return new Date(this.get(fieldName));
      });
    },
    collection: function(typeName, uriProperty, defaultAttributes) {
      uriProperty = uriProperty || typeName + "_uri";
      return Ember.computed(uriProperty, function() {
        var uri = this.get(uriProperty);
        return this.store.getCollection(typeName, uri, defaultAttributes);
      }).readOnly();
    },
    single: function(typeName, uriProperty, defaultAttributes) {
      uriProperty = uriProperty || typeName + "_uri";
      return Ember.computed(uriProperty, function() {
        var uri = this.get(uriProperty);
        return this.store.getItem(typeName, uri, defaultAttributes);
      }).readOnly();
    },
  }
};

function fetch(store, methodName, typeName, uri, attributes) {
  if (Ember.isBlank(uri)) {
    return Ember.RSVP.resolve(null);
  }
  else {
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
