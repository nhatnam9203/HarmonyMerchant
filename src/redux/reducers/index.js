import { combineReducers } from "redux";

import app from "./app";
import dataLocal from "./dataLocal";
import auth from "./auth";
import category from "./category";
import product from "./product";
import staff from "./staff";
import service from "./service";
import extra from "./extra";
import upload from "./upload";
import appointment from "./appointment";
import customer from "./customer";
import invoice from "./invoice";
import marketing from "./marketing";
import network from "./network";
import report from "./report";
import hardware from "./hardware";

const appReducer = combineReducers({
  dataLocal,
  app,
  auth,
  category,
  product,
  staff,
  service,
  extra,
  upload,
  appointment,
  customer,
  invoice,
  marketing,
  network,
  report,
  hardware
});

export default appReducer;
