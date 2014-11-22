import Ember from "ember";

var BaseAdapter = Ember.Object.extend({
	fetch: function () {
		Ember.assert("Your adapter should override #fetch", false);
  },

	create: function () {
		Ember.assert("Your adapter should override #create", false);
  },

	update: function () {
		Ember.assert("Your adapter should override #update", false);
  },

	del: function () {
		Ember.assert("Your adapter should override #del", false);
  },
});

export default BaseAdapter;
