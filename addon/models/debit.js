import Transaction from "./transaction";

var Debit = Transaction.extend({
  validations: {
    amount: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0
      }
    },
  },

  getApiProperties: function() {
    return {
      amount: this.get("amount"),
  //    appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
    };
  },
});

export default Debit;
