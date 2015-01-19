import cardAllEmpty from "./balanced-responses/card-empty";
import cardSuccess from "./balanced-responses/card-success";

var RESPONSES = {
  card: {},
  bankAccount: {}
};

RESPONSES.card.allEmpty = cardAllEmpty;
RESPONSES.card.success = cardSuccess;

export default RESPONSES;
