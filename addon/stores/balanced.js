import Ember from "ember";

var Store = Ember.Object.extend({
  modelFor: function(typeName) {
    if (typeName === "hold") {
      typeName = "card_hold";
    }

    var modelPath = "balanced-addon-models@model:" + typeName;
    var model = this.container.lookupFactory(modelPath);
    Ember.assert("Cannot find model class for " + modelPath, model);
    return model;
  },

  adapterFor: function(typeName) {
    var modelClass = this.modelFor(typeName);
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
    return Ember.A(response.items).map(function(item) {
      return this.build(item._type, item);
    }.bind(this));
  },

  build: function(typeName, attributes) {
    var model = this.modelFor(typeName).create(attributes || {});
    model.setProperties({
      container: this.container,
      store: this
    });
    return model;
  },

  fetchCollection: function(typeName, uri) {
    var collection = this.collectionFor(typeName).create({
      content: [],
      modelType: typeName,
      container: this.container,
      store: this
    });
    return collection.loadUri(uri);
  },

  fetchItem: function(typeName, uri) {
    return this.fetchCollection(typeName, uri).then(function(collection) {
      return collection.objectAt(0);
    });
  },

  fetch: function(type, uri) {
    return this.adapterFor(type).fetch(uri);
  },
});

export default Store;
