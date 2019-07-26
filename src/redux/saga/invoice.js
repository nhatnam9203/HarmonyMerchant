import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import apiConfigs from '../../configs/api';
import { requestAPI } from '../../utils';

function* getListInvoicesByMerchant(action) {
    try {
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        // console.log('responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_INVOICE_BY_MERCHANT_SUCCESS',
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
        takeLatest('GET_LIST_INVOICE_BY_MERCHANT', getListInvoicesByMerchant),
    ])
}