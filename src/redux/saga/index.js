import { all } from "redux-saga/effects";

import app from "./app";
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
import report from "./report";
import review from "./review";

export default function* sagaRoot() {
  yield all([
    app(),
    auth(),
    category(),
    product(),
    staff(),
    service(),
    extra(),
    upload(),
    appointment(),
    customer(),
    invoice(),
    marketing(),
    report(),
    review(),
  ]);
}
