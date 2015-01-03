import Transaction from "./transaction";
import ValidationHelpers from "balanced-addon-models/utils/validation-helpers";

var Debit = Transaction.extend({
  validations: {
    amount: {
      number: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0
      }
    },
    appearsOnStatementAs: {
      inline: ValidationHelpers
    }
  },
  getApiProperties: function() {
    return {
      amount: this.get("amount"),
//      dollar_amount: ValidationHelpers.positiveDollarAmount,
  //    appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
    //  name: ValidationHelpers.cardName,
//      number: ValidationHelpers.cardNumber,
  //    cvv: ValidationHelpers.cardCvv,
    //  expiration_date: ValidationHelpers.cardExpirationDate,
    };
  },
});

export default Debit;
