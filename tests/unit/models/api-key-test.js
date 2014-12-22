import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:api-key", "model - ApiKey");

test("#adapter", MH.shouldUseBalancedApiAdapter("balanced-addon-models@adapter:balanced-api-base"));
