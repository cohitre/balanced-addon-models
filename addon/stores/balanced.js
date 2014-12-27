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
    var modelPath = this.modelPathFor(typeName);
    var model = this.container.lookupFactory(modelPath);
    Ember.assert("Cannot find model " + modelPath + " for " + typeName, model);
    return model;
  },

  adapterFor: function(typeName) {
    var modelClass = typeName;
    if (Ember.typeOf(typeName) === "string") {
      modelClass = this.modelFor(typeName);
    }
    else if (Ember.typeOf(typeName) === "class") {
      modelClass = typeName;
    }
    Ember.assert("Couldn't get modelClass from " + typeName, modelClass);
    Ember.assert("Couldn't get adapterName from " + typeName, !Ember.isBlank(modelClass.adapterName));
    return this.container.lookupFactory(modelClass.adapterName).create({
      api_key: this.get("apiKey")
    });
  },

  serializerFor: function(typeName) {
    var modelClass = typeName;
    if (Ember.typeOf(typeName) === "string") {
      modelClass = this.modelFor(typeName);
    }
    else if (Ember.typeOf(typeName) === "class") {
      modelClass = typeName;
    }
    Ember.assert("Couldn't get modelClass from " + typeName, modelClass);
    Ember.assert("Couldn't get serializerName from " + typeName, !Ember.isBlank(modelClass.serializerName));
    return this.container.lookupFactory(modelClass.serializerName).create();
  },

  collectionFor: function(typeName) {
    var CollectionClass = this.container.lookupFactory("balanced-addon-models@collection:" + typeName);
    if (Ember.isBlank(CollectionClass)) {
      CollectionClass = this.collectionFor("base");
    }
    return CollectionClass;
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
    var self = this;
    var adapter = this.adapterFor(typeName);
    var serializer = this.serializerFor(typeName);

    var collection = this.collectionFor(typeName).create({
      content: [],
      modelType: typeName,
      container: this.container,
      store: this
    });

    return adapter.fetch(QueryStringCreator.uri(uri, attributes))
      .then(function(response) {
        response = serializer.extractCollection(response);
        return response;
      })
      .then(function(collectionResponse) {
        var items = self.processResponse(collectionResponse);
        collection.ingestResponse(items, collectionResponse.meta);
        return collection;
      });
  },

  fetchItem: function(typeName, uri, attributes) {
    var self = this;
    var adapter = this.adapterFor(typeName);
    var serializer = this.serializerFor(typeName);

    return adapter.fetch(QueryStringCreator.uri(uri, attributes))
      .then(function(response) {
        return serializer.extractSingle(response);
      })
      .then(function(item) {
        return self.build(typeName, item);
      });
  },

  getItem: function(typeName, uri, attributes) {
    Ember.assert("Couldn't find " + typeName + " for uri " + uri, Ember.typeOf(uri) === "string");

    var model = this.modelFor(typeName).create(attributes || {});
    model.setProperties({
      container: this.container,
      store: this
    });

    this.fetch(typeName, uri).then(function(response) {
      model.ingestJsonItem(response.items[0]);
    });
    return model;
  },

  fetch: function(type, uri) {
    return this.adapterFor(type).fetch(uri);
  },
});

export default Store;
