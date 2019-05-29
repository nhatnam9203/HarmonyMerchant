import { all } from "redux-saga/effects";

import app from './app';
import auth from './auth';

export default function* sagaRoot() {
    yield all([
        app(),
        auth()
    ])
}