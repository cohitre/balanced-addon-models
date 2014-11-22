var MethodGenerators = {
  fetchCollection: function(typeName, uriProperty) {
    uriProperty = uriProperty || typeName + "s_uri";
    return function(attributes) {
      return this.store.fetchCollection(typeName, this.get(uriProperty), attributes);
    };
  },

  fetchSingle: function(typeName, uriProperty) {
    uriProperty = uriProperty || typeName + "_uri";
    return function(attributes) {
      return this.store.fetchItem(typeName, this.get(uriProperty), attributes);
    };
  },
};

export default MethodGenerators;
