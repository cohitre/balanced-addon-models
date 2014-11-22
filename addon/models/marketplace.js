import Model from "./core/model";
import BK from "./core/method-generators";

var Marketplace = Model.extend({
  fetchOwnerCustomer: BK.fetchSingle("customer", "owner_customer_uri"),

  fetchCustomers: BK.fetchCollection("customer"),

  fetchCards: BK.fetchCollection("card"),
  fetchBankAccounts: BK.fetchCollection("bank_account"),

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
});

Marketplace.reopenClass({
  adapterName: "balanced-addon-models@adapter:balanced-api"
});

export default Marketplace;
