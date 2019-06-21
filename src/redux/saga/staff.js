import { put, takeLatest, all, join } from "redux-saga/effects";

import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addStaffByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}staff`
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
        console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getStaffByMerchantId(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('getStaffByMerchantId : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID_SUCCESS',
                payload: responses.data
            });
            yield put({
                type: 'SWICH_ADD_STAFF',
                payload: false
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
        console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchStaffByName(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('searchStaffByName : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_STAFF_BY_NAME_SUCCESS',
                payload: responses.data
            });
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
        console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveStaff(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('archiveStaff : ' + JSON.stringify(responses));
        // const { codeNumber } = responses;
        // if (parseInt(codeNumber) == 200) {
        //     yield put({
        //         type: 'GET_STAFF_BY_MERCHANR_ID_SUCCESS',
        //         payload: responses.data
        //     });
        //     yield put({
        //         type: 'SWICH_ADD_STAFF',
        //         payload: false
        //     })
        // } else if (parseInt(codeNumber) === 401) {
        //     yield put({
        //         type: 'UNAUTHORIZED'
        //     })
        // }
    } catch (error) {
        console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createAdmin(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('createAdmin : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({ type: 'STOP_LOADING_ROOT' });
            setTimeout(() => {
                alert(`Create admin success `);
            }, 200)
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
        console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

export default function* saga() {
    yield all([
        takeLatest('ADD_STAFF_BY_MERCHANT', addStaffByMerchant),
        takeLatest('GET_STAFF_BY_MERCHANR_ID', getStaffByMerchantId),
        takeLatest('SEARCH_STAFF_BY_NAME', searchStaffByName),
        takeLatest('ARCHICVE_STAFF', archiveStaff),
        takeLatest('CREATE_ADMIN', createAdmin),
    ])
}