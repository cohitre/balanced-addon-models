import Ember from "ember";
import DS from "ember-data";
import BalancedApiSerializer from "balanced-addon-models/serializers/balanced-api";
import BalancedApiAdapter from "balanced-addon-models/adapters/balanced-api";

var setupStore = function(options) {
  var env = {};
  options = options || {};

  var container = env.container = new Ember.Container();

  var adapter = env.adapter = (options.adapter || DS.Adapter);
  delete options.adapter;

  for (var prop in options) {
    container.register('model:' + prop, options[prop]);
  }

  container.register('store:main', DS.Store.extend({
    adapter: adapter
  }));

  container.register('serializer:-default', BalancedApiSerializer);
  container.register('serializer:balanced-api', BalancedApiSerializer);
  container.injection('serializer', 'store', 'store:main');
  container.injection('model', 'store', 'store:main');

  env.store = container.lookup('store:main');
  env.adapter = env.store.get('defaultAdapter');

  return env;
};

export { setupStore };
