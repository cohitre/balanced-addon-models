import Model from "./core/model";
import Ember from "ember";
import BK from "./core/method-generators";

var FundingInstrument = Model.extend({
  fetchCustomer: BK.fetchSingle('customer'),

  address: BK.attr("address"),
  canCredit: BK.attrBoolean("can_credit").readOnly(),
  canDebit: BK.attrBoolean("can_debit").readOnly(),
  meta: BK.attr("meta"),
  numberLastFour: Ember.computed("number", function() {
    var value = this.get("number");
    return Ember.typeOf(value) === "string" ?
      value.substr(value.length - 4, 4) :
      null;
  }).readOnly(),

  isBankAccount: false,
  isCard: false,

  linkToCustomer: function(customer) {
    var self = this;
    var customerUri;
    if (Ember.typeOf(customer) === "string") {
      customerUri = customer;
    }

    return self.updateProperties({
      customer: customerUri
    });
  },

  createInstance: function() {
    var deferred = Ember.RSVP.defer();
    this.getBalancedJsModel().create(this.getApiProperties(), function(response) {
      if (Ember.isBlank(response.errors)) {
        deferred.resolve(response);
      }
      else {
        deferred.reject(response);
      }
    });
    return deferred.promise;
  },
});

export default FundingInstrument;
