import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("balanced-addon-models@adapter:gandalf-api", "adapter - GandalfApi");

test("#host", function() {
  var s = this.subject();

  deepEqual(s.get("host"), "http://gandalf-prod-9mypyuyzhc.elasticbeanstalk.com");
});
