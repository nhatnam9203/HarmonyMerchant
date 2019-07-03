import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import apiConfigs from '../../configs/api';
import { requestAPI } from '../../utils';

function* login(action) {
    console.log('action : ', action);
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SAVE_PROFILE_LOCAL',
                payload: {
                    profile: responses.data.merchant,
                    token: responses.data.token,
                }
            });
            const { merchant } = responses.data;
            if (!merchant.needSetting) {
                NavigationServices.navigate('Drawer');
            } else {
                NavigationServices.navigate('SetupStore');
            }
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
        console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({
            type: 'GET_CATEGORIES_BY_MERCHANR_ID',
            method: 'GET',
            token: true,
            api: `${apiConfigs.BASE_API}category`
        })
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