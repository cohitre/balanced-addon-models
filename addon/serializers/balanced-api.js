import Ember from "ember";
import DS from "ember-data";
import JsonApiSerializer from 'ember-json-api/json_api_serializer';
import JsonApiLinkCompiler from "../lib/json-api-link-compiler";

export default JsonApiSerializer.extend({
  normalizeItem: function(modelKey, hash, links) {
    var json = {
      links: {}
    };
    for (var key in hash) {
      if (key !== 'links') {
        json[key] = hash[key];
      } else if (typeof hash[key] === 'object') {
        json.links = this.compileModelLinks(modelKey, hash, links);
      }
    }
    return json;
  },

  compileModelLinks: function(modelKey, model, globalLinks) {
    var linkKey, compiler, links = {};
    for (linkKey in globalLinks) {
      var splitKey = linkKey.split(".");
      var root = splitKey.shift();
      if (root === modelKey) {
          compiler = new JsonApiLinkCompiler(globalLinks[linkKey]);
          links[splitKey.join(".")] = {
            href: compiler.compile(modelKey, model)
          };
      }
    }
    return links;
  },

  normalizePayload: function(payload) {
    var links, hash = {};

    if (payload.meta) {
      this.extractMeta(payload.meta);
      delete payload.meta;
    }

    if (payload.linked) {
      this.extractLinked(payload.linked);
      delete payload.linked;
    }

    if (payload.links) {
      links = payload.links;
      delete payload.links;
    }

    for (var modelKey in payload) {
      hash[modelKey] = Ember.A(payload[modelKey])
        .map(function(model) {
          return this.normalizeItem(modelKey, model, links);
        }.bind(this));
    }

    return hash;
  },
});
