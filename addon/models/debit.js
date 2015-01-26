import Transaction from "./transaction";

var Debit = Transaction.extend({
  getApiProperties: function() {
    return {
      amount: this.get("amount"),
  //    appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
    };
  },
});

export default Debit;
