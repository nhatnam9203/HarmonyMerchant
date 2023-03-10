import { put, takeLatest, all } from "redux-saga/effects";

import { requestAPI } from '../../utils';
import Configs from '@configs';

function* addExtraByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter = action?.searchFilter || { keySearch: "", status: "" };
            const { keySearch, status } = searchFilter;
            yield put({
                type: 'GET_EXTRA_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `extra/search?name=${keySearch}&status=${status}`,
                isShowLoading: true,
                searchFilter:  action?.searchFilter || false
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getExtraByMerchant(action) {
    try {
        if(action.isShowLoading){
            yield put({ type: 'LOADING_ROOT' })
        }
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter =  action?.searchFilter || { keySearch: "", status: "" };
            const { keySearch, status } = searchFilter;
            const tempSearchFilter = keySearch || status ? true : false;
            yield put({
                type: 'GET_EXTRA_BY_MERCHANT_SUCCESS',
                payload: responses.data,
                searchFilter: tempSearchFilter
            });
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({ type: 'GET_EXTRA_BY_MERCHANT_FAIL' });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'GET_EXTRA_BY_MERCHANT_FAIL' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveExtra(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter =  action?.searchFilter || { keySearch: "", status: "" };
            const { keySearch, status } = searchFilter;
            yield put({ type: 'IS_GET_LIST_SEARCH_EXTRA' });
            yield put({
                type: 'GET_EXTRA_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `extra/search?name=${keySearch}&status=${status}`,
                isShowLoading: true,
                searchFilter: action?.searchFilter || false
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restoreExtra(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter = action?.searchFilter || { keySearch: "", status: "" };
            const { keySearch, status } = searchFilter;
            yield put({ type: 'IS_GET_LIST_SEARCH_EXTRA' });
            yield put({
                type: 'GET_EXTRA_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `extra/search?name=${keySearch}&status=${status}`,
                isShowLoading: true,
                searchFilter: action?.searchFilter || false
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* editExtra(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter =  action?.searchFilter || { keySearch: "", status: "" };
            const { keySearch, status } = searchFilter;
            yield put({ type: 'IS_GET_LIST_SEARCH_EXTRA' });
            yield put({
                type: 'GET_EXTRA_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `extra/search?name=${keySearch}&status=${status}`,
                isShowLoading: true,
                searchFilter:  action?.searchFilter || false
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchExtra(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_EXTRA_SUCCESS',
                payload: responses.data
            });
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updatePositionExtras(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

export default function* saga() {
    yield all([
        takeLatest('ADD_EXTRA_BY_MERCHANT', addExtraByMerchant),
        takeLatest('GET_EXTRA_BY_MERCHANT', getExtraByMerchant),
        takeLatest('ARCHIVE_EXTRA', archiveExtra),
        takeLatest('RESTORE_EXTRA', restoreExtra),
        takeLatest('EDIT_EXTRA', editExtra),
        takeLatest('SEARCH_EXTRA', searchExtra),
        takeLatest('UPDATE_POSITION_EXTRAS', updatePositionExtras),
    ])
}
