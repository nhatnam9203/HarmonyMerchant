import { put, takeLatest, all, join } from "redux-saga/effects";

import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addCategory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}category`,
                isShowLoading: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
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

function* getCategoriesByMerchantId(action) {
    try {
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        // console.log('getCategoriesByMerchantId : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID_SUCCESS',
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID_FAIL',
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

function* archiveCategory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        // console.log('--- responses : ', responses);
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}category`,
                isShowLoading: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
        // console.log('error : ', error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restoreCategory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        // console.log('--- restoreCategory : ', responses);
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}category`,
                isShowLoading: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
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

function* editCategory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}category`,
                isShowLoading: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
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

function* searchCategories(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_CATEGORIES_SUCCESS',
                payload: responses.data
            });
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
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


export default function* saga() {
    yield all([
        takeLatest('ADD_CATEGORY', addCategory),
        takeLatest('GET_CATEGORIES_BY_MERCHANR_ID', getCategoriesByMerchantId),
        takeLatest('ARCHIVE_CATEGORY', archiveCategory),
        takeLatest('RESTORE_CATEGORY', restoreCategory),
        takeLatest('EDIT_CATEGORY', editCategory),
        takeLatest('SEARCH_CATEGORIES', searchCategories),
    ])
}