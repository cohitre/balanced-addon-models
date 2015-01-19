import Ember from "ember";

var DebitCardController = Ember.Controller.extend({
  save: function(fundingInstrument, debit) {
    return fundingInstrument.validate()
      .then(function() {
        return debit.validate();
      })
      .then(function() {
        return fundingInstrument.save();
      })
      .then(function() {
        return fundingInstrument.reload();
      })
      .then(function() {
        return debit.save();
      })
      .then(undefined, function() {
        return Ember.RSVP.reject();
      });
  },
});

export default DebitCardController;
