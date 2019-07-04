import { put, takeLatest, all, join } from "redux-saga/effects";

import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addServiceByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service`,
                isShowLoading: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getServicesByMerchant(action) {
    try {
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        console.log('getServicesByMerchant : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT_SUCCESS',
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SEARCH_SERVICE_FAIL',
            });
        }
    } catch (error) {
        if (`${error}` == 'TypeError: Network request failed') {
            alert('Network fail')
        }
        console.log(`error : ${error}`);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        console.log('--- responses : ', responses);
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service`,
                isShowLoading: true
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

function* restoreService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        console.log('--- restoreService : ', responses);
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service`,
                isShowLoading: true
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

function* editService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service`,
                isShowLoading: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_SERVICE_SUCCESS',
                payload: responses.data
            });
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


export default function* saga() {
    yield all([
        takeLatest('ADD_SERVICE_BY_MERCHANT', addServiceByMerchant),
        takeLatest('GET_SERVICE_BY_MERCHANT', getServicesByMerchant),
        takeLatest('ARCHIVE_SERVICE', archiveService),
        takeLatest('RESTORE_SERVICE', restoreService),
        takeLatest('EDIT_SERVICE', editService),
        takeLatest('SEARCH_SERVICE', searchService),
    ])
}