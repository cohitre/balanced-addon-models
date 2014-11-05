import FundingInstrument from "./funding-instrument";

var EXPECTED_CREDIT_DAYS_OFFSET = 2;
var Card = FundingInstrument.extend({
  expectedCreditDaysOffset: EXPECTED_CREDIT_DAYS_OFFSET,
});

export default Card;
