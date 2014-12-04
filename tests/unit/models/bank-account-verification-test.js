import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:bank-account-verification", "model - BankAccountVerification");

test("#adapter", MH.shouldUseBalancedApiAdapter());
