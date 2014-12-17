import Ember from "ember";
import QueryStringCreator from "balanced-addon-models/utils/query-string-creator";

var Store = Ember.Object.extend({
  modelMaps: {
    "hold": "balanced-addon-models@model:card_hold"
  },

  modelPathFor: function(typeName) {
    var mapped = this.modelMaps[typeName];

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
    return this.container.lookupFactory(modelClass.adapterName).create({
      api_key: this.get("apiKey")
    });
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
    var collection = this.collectionFor(typeName).create({
      content: [],
      modelType: typeName,
      container: this.container,
      store: this
    });

    uri = QueryStringCreator.uri(uri, attributes);
    return collection.loadUri(uri);
  },

  fetchItem: function(typeName, uri, attributes) {
    return this.fetchCollection(typeName, uri, attributes).then(function(collection) {
      return collection.objectAt(0);
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
