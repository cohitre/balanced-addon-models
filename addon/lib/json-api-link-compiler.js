import Ember from "ember";

var PROPERTY_REGEXP = /\{([^}]+)\}/g;
var JsonApiLinkCompiler = function(href) {
  this.href = href;
};

JsonApiLinkCompiler.prototype.compile = function(key, model) {
  var propertyNotFound = false;
  var href = this.href.replace(PROPERTY_REGEXP, function(match, propertyName) {
    var propertyValue = this.resolveProperty(key, propertyName, model);
    if (Ember.isBlank(propertyValue)) {
      propertyNotFound = true;
    }
    return propertyValue;
  }.bind(this));
  if (propertyNotFound) {
    return null;
  }
  else {
    return href;
  }
};

JsonApiLinkCompiler.prototype.resolveProperty = function(key, propertyName, model) {
  var propertyFields = propertyName.split(".");
  if (propertyFields.shift() === key) {
    var property = Ember.get(model, propertyFields.join("."));
    return Ember.isBlank(property) ?
      Ember.get(model, "links." + propertyFields.join(".")) :
      property;
  }
};

export default JsonApiLinkCompiler;
