import Ember from "ember";
import QueryStringCreator from "balanced-addon-models/utils/query-string-creator";

var Store = Ember.Object.extend({
  modelMaps: {
    "hold": "balanced-addon-models@model:card_hold"
  },

  modelPathFor: function(typeName) {
    var mapped = this.modelMaps[typeName.replace(/-/g, "_")];

    if (Ember.isBlank(mapped)) {
      return "balanced-addon-models@model:" + typeName;
    }
    else {
      return mapped;
    }
  },

  modelFor: function(typeName) {
    var model;
    if (Ember.typeOf(typeName) === "string") {
      model = this.container.lookupFactory(this.modelPathFor(typeName));
    }
    else if (Ember.typeOf(typeName) === "class") {
      model = typeName;
    }
    Ember.assert("Cannot find model for " + typeName, model);
    return model;
  },

  adapterFor: function(typeName) {
    return buildRelatedInstance(this, typeName, "adapterName", {
      api_key: this.get("apiKey")
    });
  },

  serializerFor: function(typeName) {
    return buildRelatedInstance(this, typeName, "serializerName");
  },

  collectionFor: function(typeName) {
    return buildRelatedInstance(this, typeName, "collectionName", {
      content: [],
      modelType: typeName,
      container: this.container,
      store: this
    });
  },

  processResponse: function(response) {
    var self = this;
    return Ember.A(response.items).map(function(item) {
      return self.build(item._type, item);
    });
  },

  build: function(typeName, attributes) {
    var model = this.modelFor(typeName).create();
    model.ingestJsonItem(attributes);
    model.setProperties({
      container: this.container,
      store: this
    });
    return model;
  },

  fetchCollection: function(typeName, uri, attributes) {
    var collection = this.collectionFor(typeName);
    return this.loadIntoCollection(typeName, collection, uri, attributes);
  },

  getCollection: function(typeName, uri, attributes) {
    var collection = this.collectionFor(typeName);
    this.loadIntoCollection(typeName, collection, uri, attributes)
      .finally(function() {
        collection.set("isLoaded", true);
      });
    return collection;
  },

  loadIntoCollection: function(typeName, collection, uri, attributes) {
    var self = this;
    var adapter = this.adapterFor(typeName);
    var serializer = this.serializerFor(typeName);

    return adapter.fetch(QueryStringCreator.uri(uri, attributes))
      .then(function(response) {
        return serializer.extractCollection(response);
      })
      .then(function(collectionResponse) {
        var items = Ember.A(collectionResponse.items).map(function(item) {
          return self.build(item._type || typeName, item);
        });
        collection.set("meta", collectionResponse.meta);
        collection.pushObjects(items);
        return collection;
      });
  },

  fetchItem: function(typeName, uri, attributes) {
    var self = this;
    var serializer = this.serializerFor(typeName);

    return this.adapterFor(typeName)
      .fetch(QueryStringCreator.uri(uri, attributes))
      .then(function(response) {
        return serializer.extractSingle(response);
      })
      .then(function(item) {
        return self.build(typeName, item);
      });
  },

  getItem: function(typeName, uri, attributes) {
    var model = this.build(typeName, attributes || {});
    model.set("href", uri);
    model.reload();
    return model;
  },
});

function buildRelatedInstance(store, typeName, attributeName, attributes) {
  var modelClass = store.modelFor(typeName);
  var value = modelClass[attributeName];

  Ember.assert("Couldn't get " + attributeName + " from " + typeName, !Ember.isBlank(value));

  var klass = store.container.lookupFactory(value);
  Ember.assert("Couldn't get " + attributeName + " instance from " + typeName, !Ember.isBlank(klass));
  return klass.create(attributes);
}

export default Store;
