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
        "if": "isProduction"
      },
    },
    supportEmailAddress: {
      presence: {
        "if": "isProduction"
      },
    },
    supportPhoneNumber: {
      presence: {
        "if": "isProduction"
      },
      length: {
        maximum: 15
      },
      inline: EmberValidations.validator(function() {
        if (this.get("isProduction")) {
          return VH.validatePhoneFormat(this.get("supportPhoneNumber"));
        }
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

  name: BK.attr("name"),
  domainUrl: BK.attr("domain_url"),
  supportPhoneNumber: BK.attr("support_phone_number"),
  supportEmailAddress: BK.attr("support_email_address"),
  meta: BK.attr("meta"),

  href: BK.attr("href").readOnly(),
  createdAt: BK.attrStringToDate("created_at").readOnly(),
  updatedAt: BK.attrStringToDate("updated_at").readOnly(),
  isProduction: BK.attr("production").readOnly(),
  isTest: Ember.computed.not("isProduction").readOnly(),

  escrowDollars: BK.attrCentsToDollars("in_escrow").readOnly(),
  unsettledFeesDollars: BK.attrCentsToDollars("unsettled_fees").readOnly(),

  getDebuggingProperties: function() {
    return Ember.merge(this.getApiProperties(), {
      id: this.get("id")
    });
  },
});

Marketplace.reopenClass({
  API_PROPERTIES: ["name", "domain_url", "support_email_address", "support_phone_number", "meta"],
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Marketplace;
