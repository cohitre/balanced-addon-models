// import Ember from "ember";
import Model from "./core/model";
import BK from "./core/method-generators";

var Customer = Model.extend({
  name: BK.attr('name'),

  dateOfBirthMonth: BK.attr("dob_month"),
  dateOfBirthYear: BK.attr("dob_year"),
  dateOfBirth: BK.attrYearMonthFields("dateOfBirthYear", "dateOfBirthMonth"),

  phone: BK.attr("phone"),
  address: BK.attr("address"),
  merchantStatus: BK.attr("merchant_status"),
  meta: BK.attr("meta"),
  socialSecurityNumberLast4: BK.attr("ssn_last4"),
  employerIdentificationNumber: BK.attr("ein"),
  email: BK.attr("email"),

  businessName: BK.attr("business_name"),

  createUri: "/customers",
});

Customer.reopenClass({
  API_PROPERTIES: ["address", "business_name", "dob_month", "dob_year", "ein", "email", "meta", "name", "phone", "source", "ssn_last4"]
});

export default Customer;
