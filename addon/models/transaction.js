import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var Transaction = Model.extend({
  validations: {
    amount: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    amountDollars: {
      presence: true,
      numericality: {
        greaterThan: 0
      }
    },
  },

  fetchEvents: BK.fetchCollection("event"),
  fetchLogs: BK.fetchCollectionForUri("log", "/logs", {
    method: ["post", "put", "delete"],
    resource_id: function() {
      return this.get("id");
    },
  }),

  isUnlinked: Ember.computed.not("__attributes.links.order"),

  amount: BK.attrNumber("amount"),
  amountDollars: BK.attrCentsToDollars("amount"),

  appearsOnStatementAs: BK.attr("appears_on_statement_as")
});

export default Transaction;
