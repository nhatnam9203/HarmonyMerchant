import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import apiConfigs from '../../configs/api';
import { requestAPI } from '../../utils';

function* login(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SAVE_PROFILE_LOCAL',
                payload: {
                    profile: responses.data.merchant,
                    token: responses.data.token,
                }
            });
            yield put({
                type: 'LOGIN_APP_SUCCESS'
            });
            yield put({ type: 'STOP_LOADING_ROOT' });
            NavigationServices.navigate('Splash');
        } else {
            yield put({
                type: 'LOGIN_APP_FAIL',
                payload: responses
            })
        }
    } catch (error) {
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* expiredToken(action) {
    NavigationServices.navigate('SignIn');
    yield put({ type: 'LOGOUT_APP' });
}


export default function* saga() {
    yield all([
        takeLatest('LOGIN_APP', login),
        takeLatest('UNAUTHORIZED', expiredToken),
    ])
}