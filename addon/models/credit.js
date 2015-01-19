import Transaction from "./transaction";

var Credit = Transaction.extend({
  validations: {
    amount: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0
      }
    },
  },

});

export default Credit;
