import Transaction from "./transaction";

var Debit = Transaction.extend({
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

  getApiProperties: function() {
    return {
      amount: this.get("amount"),
  //    appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
    };
  },
});

export default Debit;
