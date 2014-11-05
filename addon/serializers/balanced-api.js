import Ember from "ember";
import DS from "ember-data";
import JsonApiSerializer from 'ember-json-api/json_api_serializer';

export default JsonApiSerializer.extend({
  extractLinks: function(links) {
    var link, key, value, route, linkEntry, extracted = [];

    for (link in links) {
      key = link;
      value = links[link];
      if (typeof value === 'string') {
        route = value;
      } else {
        key = value.type || key;
        route = value.href;
      }

      linkEntry = { };
      linkEntry[key] = route;
      extracted.push(linkEntry);
      DS._routes[key] = route;
    }
    return extracted;
  },

  normalize: function(type, hash, prop) {
    var normalizeLinks = function(json, link, linkValue) {
        if (linkValue && typeof linkValue === 'object' && linkValue.href) {
          json.links[link] = {
            href: linkValue.href
          };
        } else if(linkValue && typeof linkValue === 'object' && linkValue.ids) {
          json.links[link] = {
            ids: linkValue.ids
          };
        } else {
          json[link] = linkValue;
        }
    };

    var json = {
      links: {}
    };
    for (var key in hash) {
      if (key !== 'links') {
        json[key] = hash[key];
      } else if (typeof hash[key] === 'object') {
        for (var link in hash[key]) {
          normalizeLinks(json, link, hash[key][link]);
        }
      }
    }

    type.eachRelationship(function(key) {
      var href = DS._routes[prop + "." + key.decamelize()];
      href = href.replace(/\{([^}]+)\}/, function(a, prop) {
        var split = prop.split(".");
        split.shift();
        split = split.join(".");
        return Ember.get(json, split);
      });
      Ember.set(json, "links." + key, {
        href: href
      });
    });
    return this._super(type, json, prop);
  },
});
