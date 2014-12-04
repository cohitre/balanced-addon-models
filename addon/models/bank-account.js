import FundingInstrument from "./funding-instrument";
import BK from "./core/method-generators";

export default FundingInstrument.extend({
  isBankAccount: true,
  fetchVerifications: BK.fetchCollection("bank_account_verification")
});
