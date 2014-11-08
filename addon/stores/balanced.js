import DS from "ember-data";

export default DS.Store.extend({
  findUri: function(typeName, uri) {
    var type = this.modelFor(typeName);
    var adapter = this.adapterFor(type);
    var array = this.recordArrayManager.createAdapterPopulatedRecordArray(type, uri);
    return _findUri(adapter, this, type, uri, array);
  },
});

function serializerForAdapter(adapter, type) {
  var defaultSerializer = adapter.defaultSerializer;
  var container = adapter.container;
  return container.lookup('serializer:'+type.typeKey) ||
    container.lookup('serializer:application') ||
    container.lookup('serializer:' + defaultSerializer) ||
    container.lookup('serializer:-default');
}

function _findUri(adapter, store, type, uri, recordArray) {
  var serializer = serializerForAdapter(adapter, type);
  return adapter.findUri(store, type, uri, recordArray).then(function(adapterPayload) {
    var payload = serializer.extract(store, type, adapterPayload, null, 'findQuery');
    recordArray.load(payload);
    return recordArray;
  }, null);
}
