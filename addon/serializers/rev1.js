import Ember from "ember";

var Rev1Serializer = Ember.Object.extend({
	extractCollection: function(rootJson) {
		var collection = Ember.A();
		var self = this;

		var populateFunc = function(val, typeName) {
			collection.push(self._populateObject(val, typeName, rootJson));
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

	_populateObject: function(modelObj, objType, rootJson) {
		var linksValues = {};
		linksValues[objType + '.id'] = modelObj.id;
		linksValues[objType + '.self'] = modelObj.id;

		if (modelObj.links) {
			for (var key in modelObj.links) {
				linksValues[objType + '.' + key] = modelObj.links[key];
			}
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
		for (var link in rootJson.links) {
			if (link.indexOf(objPropertyName + ".") === 0) {
				var linkName = link.substring(objPropertyName.length + 1);

				// Template all the links
				var href = rootJson.links[link];

				try {
					var replacedHref = href.replace(/\{([\.\w]+)\}/g, replaceHrefFunc);
					templatedLinks[linkName] = replacedHref;
				} catch (e) {
					templatedLinks[linkName] = null;
				}
			}
		}

		for (link in templatedLinks) {
			modelObj[link + "_uri"] = templatedLinks[link];
		}

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
