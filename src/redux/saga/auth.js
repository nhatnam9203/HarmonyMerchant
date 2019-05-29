import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI } from '../../utils';

function* test(action) {
    try {
        console.log('--- saga catch ---');
        yield put({ ...action, type: "TEST_USER_SUCCESS"});
        NavigationServices.navigate("Main");
        // yield put({ ...action, type: "REGISTER_USER_SUCCESS", payload: responses });
        // const responses = yield requestAPI(action);
        // responses.status ?
        //     yield put({ ...action, type: "REGISTER_USER_SUCCESS", payload: responses })
        //     : yield put({ ...action, type: "REGISTER_USER_FAIL", payload: responses })
        
    } catch (error) {
    }
}


export default function* saga() {
    yield all([
        takeLatest('TEST', test),
    ])
}