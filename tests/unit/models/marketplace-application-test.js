import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import MH from "../../helpers/model-helpers";

moduleFor("balanced-addon-models@model:marketplace-application", "model - MarketplaceApplication");

test("#adapter", MH.shouldUseBalancedApiAdapter("balanced-addon-models@adapter:gandalf-api"));
