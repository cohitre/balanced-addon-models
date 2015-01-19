import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:gandalf-api", "adapter - GandalfApi");

test("#host", function() {
  deepEqual(this.subject().get("host"), "https://gandalf.vandelay.io");
});
