import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";
import VH from "../utils/validation-helpers";
import EmberValidations from "ember-validations";

var Marketplace = Model.extend({
  validations: {
    name: {
      presence: true
    },
    domainUrl: {
      presence: {
        "unless": "isTest"
      },
    },
    supportEmailAddress: {
      presence: {
        "unless": "isTest"
      },
    },
    supportPhoneNumber: {
      presence: {
        "unless": "isTest"
      },
      length: {
        maximum: 15
      },
      inline: EmberValidations.validator(function() {
        return VH.validatePhoneFormat(this.get("supportPhoneNumber"), !this.get("isTest"));
      })
    }
  },

  fetchOwnerCustomer: BK.fetchSingle("customer", "owner_customer_uri"),
  fetchCustomers: BK.fetchCollection("customer"),
  fetchCards: BK.fetchCollection("card"),
  fetchBankAccounts: BK.fetchCollection("bank_account"),

  fetchFundingInstruments: BK.fetchCollectionForUri("funding_instrument", "/search", {
    type: ["bank_account", "card"]
  }),

  fetchTransactions: BK.fetchCollection("transaction"),
  fetchCardHolds: BK.fetchCollection("card_hold"),
  fetchCredits: BK.fetchCollection("credit"),
  fetchDebits: BK.fetchCollection("debit"),
  fetchRefunds: BK.fetchCollection("refund"),
  fetchReversal: BK.fetchCollection("reversal"),

  fetchCallbacks: BK.fetchCollection("callback"),
  fetchDisputes: BK.fetchCollection("dispute"),
  fetchEvents: BK.fetchCollection("event"),
  fetchOrders: BK.fetchCollection("order"),

  fetchLogs: BK.fetchCollectionForUri("log", "/logs"),

  createUri: "/marketplaces",

  getApiProperties: function() {
    return {
      name: this.get("name"),
      domain_url: this.get("domainUrl"),
      support_email_address: this.get("supportEmailAddress"),
      support_phone_number: this.get("supportPhoneNumber"),
    };
  },

  getDebuggingProperties: function() {
    return Ember.merge(this.getApiProperties(), {
      id: this.get("id")
    });
  },
});

Marketplace.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Marketplace;
