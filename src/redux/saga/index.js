import { all } from "redux-saga/effects";

import app from './app';
import auth from './auth';
import category from './category';
import product from './product';
import staff from './staff';

export default function* sagaRoot() {
    yield all([
        app(),
        auth(),
        category(),
        product(),
        staff()
    ])
}