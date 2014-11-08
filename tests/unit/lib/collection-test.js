import Collection from "balanced-addon-models/lib/collection";

module("lib - Collection");

test("#totalCount", function() {
  var subject = Collection.create();
  subject.set("meta", {
    total: 100
  });

  deepEqual(subject.get("totalCount"), 100);
});
