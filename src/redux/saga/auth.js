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
        yield put({
            type: 'LOGIN_APP_FAIL',
            payload: responses
        })
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* forgotPassword(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            NavigationServices.navigate('SignIn');
            setTimeout(() =>{
                alert(`Please check email : ${action.email}`)
            },300)
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: error });
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
        takeLatest('FORGOT_PASSWORD', forgotPassword),
        
    ])
}