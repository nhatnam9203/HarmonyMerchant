import { put, takeLatest, all } from "redux-saga/effects";

import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addServiceByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter = action?.searchFilter || { keySearch: "", category: "", status: "" };
            const { keySearch, category, status } = searchFilter;
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service/search?name=${keySearch}&category=${category}&status=${status}`,
                isShowLoading: true,
                searchFilter: action?.searchFilter || false
            })
            yield put({
                type: 'GET_EXTRA_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}extra`,
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
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

function* getServicesByMerchant(action) {
    try {
        if( action.isShowLoading){
            yield put({ type: 'LOADING_ROOT' })
        }
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter = action?.searchFilter || { keySearch: "", category: "", status: "" };
            const { keySearch, category, status } = searchFilter;
            const tempSearchFilter = keySearch || category || status ? true : false;
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT_SUCCESS',
                payload: responses.data,
                searchFilter: tempSearchFilter
            });
            if (action.isGetListExtra) {
                yield put({
                    type: 'GET_EXTRA_BY_MERCHANT',
                    method: 'GET',
                    token: true,
                    api: `${apiConfigs.BASE_API}extra`,
                })
            }
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({ type: 'GET_SERVICE_BY_MERCHANT_FAIL' });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: 'GET_SERVICE_BY_MERCHANT_FAIL' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter =  action?.searchFilter || { keySearch: "", category: "", status: "" };
            const { keySearch, category, status } = searchFilter;
            yield put({ type: 'IS_GET_LIST_SEARCH_SERVICE' });
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service/search?name=${keySearch}&category=${category}&status=${status}`,
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
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restoreService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter = action?.searchFilter || { keySearch: "", category: "", status: "" };
            const { keySearch, category, status } = searchFilter;
            yield put({ type: 'IS_GET_LIST_SEARCH_SERVICE' });
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service/search?name=${keySearch}&category=${category}&status=${status}`,
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
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* editService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const searchFilter =  action?.searchFilter || { keySearch: "", category: "", status: "" };
            const { keySearch, category, status } = searchFilter;
            yield put({ type: 'IS_GET_LIST_SEARCH_SERVICE' });
            yield put({
                type: 'GET_SERVICE_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}service/search?name=${keySearch}&category=${category}&status=${status}`,
                isShowLoading: true,
                isGetListExtra: true,
                searchFilter: action?.searchFilter || false
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
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

function* searchService(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
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
        } else {
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

function* updateSerivePosition(action) {
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
                message: responses.message
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
        takeLatest('ADD_SERVICE_BY_MERCHANT', addServiceByMerchant),
        takeLatest('GET_SERVICE_BY_MERCHANT', getServicesByMerchant),
        takeLatest('ARCHIVE_SERVICE', archiveService),
        takeLatest('RESTORE_SERVICE', restoreService),
        takeLatest('EDIT_SERVICE', editService),
        takeLatest('SEARCH_SERVICE', searchService),
        takeLatest('UPDATE_SERVICE_POSITION', updateSerivePosition),
    ])
}