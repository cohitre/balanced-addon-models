import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:card-hold", "model - CardHold", {
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence'
  ]
});

test("#adapter", MH.shouldUseBalancedApiAdapter());
test("#serializer", MH.shouldUseBalancedApiSerializer());
