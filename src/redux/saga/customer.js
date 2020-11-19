import { put, takeLatest, all } from "redux-saga/effects";

import apiConfigs from '../../configs/api';
import { requestAPI } from '../../utils';

function* getListCustomersByMerchant(action) {
    try {
        if (action.isShowLoading) {
            yield put({ type: 'LOADING_ROOT' });
        }
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS',
                payload: responses.data
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({ type: 'GET_LIST_CUSTOMER_BY_MERCHANT_FAIL' });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: 'GET_LIST_CUSTOMER_BY_MERCHANT_FAIL' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchCustomer(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_CUSTOMER_SUCCESS',
                payload: responses.data
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

function* addCustomer(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_CUSTOMER_BY_MERCHANT',
                method: 'GET',
                api: `${apiConfigs.BASE_API}customer/bymerchant`,
                token: true,
                isShowLoading: true
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

function* editCustomer(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_CUSTOMER_BY_MERCHANT',
                method: 'GET',
                api: `${apiConfigs.BASE_API}customer/search?key=${action.keySearch}`,
                token: true,
                isShowLoading: true
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

function* getCustomerInfoByPhone(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
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

function* sendGoogleReviewLink(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log("--- sendGoogleReviewLink: ", responses);

        // yield put({ type: 'STOP_LOADING_ROOT' });
        // const { codeNumber } = responses;
        // if (parseInt(codeNumber) == 200) {


        // } else if (parseInt(codeNumber) === 401) {
        //     yield put({
        //         type: 'UNAUTHORIZED'
        //     })
        // } else {
        //     yield put({
        //         type: 'SHOW_ERROR_MESSAGE',
        //         message: responses.message
        //     })
        // }
    } catch (error) {
        // yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}



export default function* saga() {
    yield all([
        takeLatest('GET_LIST_CUSTOMER_BY_MERCHANT', getListCustomersByMerchant),
        takeLatest('SEARCH_CUSTOMER', searchCustomer),
        takeLatest('ADD_CUSTOMER', addCustomer),
        takeLatest('EDIT_CUSTOMER', editCustomer),
        takeLatest('GET_CUSTOMER_INFO_BY_PHONE', getCustomerInfoByPhone),
        takeLatest('SEND_GOOGLE_REVIEW_LIINK', sendGoogleReviewLink),

    ])
}