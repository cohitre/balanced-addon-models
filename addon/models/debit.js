import Transaction from "./transaction";
import BK from "./core/method-generators";

export default Transaction.extend({
  fetchDispute: BK.fetchSingle("dispute")
});
