import DS from "ember-data";

var FundingInstrument = DS.Model.extend({
  customer: DS.belongsTo("customer", {
    async: true
  })
});

export default FundingInstrument;
