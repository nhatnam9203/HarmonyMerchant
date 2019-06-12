import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI } from '../../utils';

function* login(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            NavigationServices.navigate('Main');
            yield put({
                type: 'SAVE_PROFILE_LOCAL',
                payload: {
                    profile: responses.data.merchant,
                    token: responses.data.token,
                }
            });
            yield put({
                type: 'LOGIN_APP_SUCCESS'
            })
        } else {
            yield put({
                type: 'LOGIN_APP_FAIL',
                payload: responses
            })
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* expiredToken(action) {
    NavigationServices.navigate('SignIn');
}


export default function* saga() {
    yield all([
        takeLatest('LOGIN_APP', login),
        takeLatest('UNAUTHORIZED', expiredToken),

    ])
}