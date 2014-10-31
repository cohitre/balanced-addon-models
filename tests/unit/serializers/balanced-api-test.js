import DS from "ember-data";
import { test, moduleFor } from 'ember-qunit';
import { setupStore } from "../../helpers/ember_configuration";

module("serialize - BalancedApiSerializer");

test("#normalize() can handle null links", function() {
  var Manufacturer = DS.Model.extend({});
  var CarModel = DS.Model.extend({
    name: DS.attr(),
    manufacturer: DS.belongsTo("manufacturer")
  });

  var env = setupStore({
    manufacturer: Manufacturer,
    carModel: CarModel
  });

  var subject = env.container.lookup("serializer:balanced-api");
  console.log(subject, subject.store);
  var json = {
    name: "Durango",
    links: {
      manufacturer: null,
    }
  };
  console.log(env.container);

  var result = subject.normalize(env.container.lookupFactory("model:carModel"), json, "car_models");
  deepEqual(result.name, "Durango");
  deepEqual(result.manufacturer, null);
});
