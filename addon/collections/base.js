import Ember from "ember";

export default Ember.ArrayProxy.extend({
  isLoaded: false,

  nextUri: Ember.computed.reads("meta.next"),
  totalCount: Ember.computed.reads("meta.total"),

  hasNextPage: Ember.computed("meta", function() {
    return !Ember.isBlank(this.get("nextUri"));
  }),

  loadUri: function(uri) {
    return this.loadUris([uri]);
  },

  loadUris: function(uris) {
    var self = this;
    var promises = Ember.A(uris).map(function(uri) {
      return this.get("store").loadIntoCollection(this.modelType, this, uri);
    }, this);
    self.set("isLoaded", false);
    return Ember.RSVP.all(promises)
      .then(function() {
        self.set("isLoaded", true);
        return self;
      }, function() {
        self.set("isLoaded", true);
        return Ember.RSVP.reject(self);
      });
  },

  loadNext: function() {
    return this.loadUri(this.get("nextUri"));
  },
});
