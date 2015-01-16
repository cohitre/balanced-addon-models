import Base from "./base";
import QueryStringCreator from "balanced-addon-models/utils/query-string-creator";

export default Base.extend({
  load: function() {
    var href = QueryStringCreator.uri("/search", {
      q: this.get("query"),
      type: this.getType()
    });
    return this.loadUri(href);
  },

  type: "transaction",

  getType: function() {
    var type = this.get("type");
    if (type === "transaction") {
      return ["credit", "debit", "card_hold", "refund", "reversal"];
    }
    else {
      return type;
    }
  },
});
