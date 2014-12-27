import Ember from "ember";

var Rev1Serializer = Ember.Object.extend({
	extractCollection: function(rootJson) {
    var self = this;
    var collection = Ember.A();

		var populateFunc = function(val, typeName) {
			collection.push(self.populateObject(val, typeName, rootJson));
		};

		each(rootJson, function(values, typeName) {
      if (Ember.isArray(values)) {
        each(values, function(value)  {
          populateFunc(value, typeName);
        });
      }
    });

		return {
			items: collection,
			linked: rootJson.linked,
      meta: rootJson.meta
		};
	},

  extractSingle: function(rootJson) {
    var result = this.extractCollection(rootJson);
    return result.items[0];
  },

	populateObject: function(modelObj, objType, rootJson) {
		var linksValues = {};
		linksValues[objType + '.id'] = modelObj.id;
		linksValues[objType + '.self'] = modelObj.id;

		if (modelObj.links) {
      each(modelObj.links, function(value, key) {
				linksValues[objType + '.' + key] = value;
      });
		}

		var replaceHrefFunc = function(match, linkParam) {
			var replacement = linksValues[linkParam];

			if (replacement === undefined) {
				Ember.Logger.warn("Couldn't find replacement for param %@".fmt(linkParam));
				throw new Error("Undefined value for URL macro");
			}

			if (replacement === null) {
				throw new Error("Null value for URL macro");
			}

			return replacement;
		};

		var templatedLinks = {};
		var objPropertyName = objType;
    each(rootJson.links, function(href, link) {
			if (link.indexOf(objPropertyName + ".") === 0) {
				var linkName = link.substring(objPropertyName.length + 1);
				try {
					var replacedHref = href.replace(/\{([\.\w]+)\}/g, replaceHrefFunc);
					templatedLinks[linkName] = replacedHref;
				} catch (e) {
					templatedLinks[linkName] = null;
				}
			}
		});

    each(templatedLinks, function(value, link) {
			modelObj[link + "_uri"] = value;
    });

		modelObj.uri = modelObj.href;
		modelObj._type = objType.replace(/s$/, '');
		return modelObj;
	},
});

function each(object, callback) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      callback.call(object[key], object[key], key);
    }
  }
  return object;
}

export default Rev1Serializer;
