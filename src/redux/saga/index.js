import { all } from "redux-saga/effects";

import app from './app';

export default function* sagaRoot() {
    yield all([
        app(),
    ])
}