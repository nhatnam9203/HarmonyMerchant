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
                payload: responses.data,
                totalPages: responses.pages,
                currentPage: action.currentPage
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({type :'GET_LIST_INVOICE_BY_MERCHANT_FAIL'});
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({type :'GET_LIST_INVOICE_BY_MERCHANT_FAIL'});
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchInvoice(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('searchInvoice : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_INVOICE_SUCCESS',
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

// ----------- Settle ------------

function* getSettlementWating(action) {
    try {
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        // console.log('getSettlementWating  : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SETTLEMENT_WAITING_SUCCESS',
                payload: responses.data
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'GET_SETTLEMENT_WAITING_FAIL',
            })
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({
            type: 'GET_SETTLEMENT_WAITING_FAIL',
        })
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* invoicesOfStaff(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('getSettlementWating  : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'INVOICE_OFF_STAFF_SUCCESS',
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


function* getTransactionSettlement(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('getTransactionSettlement  : ' + JSON.stringify(responses.data));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_TRANSACTION_SETTLEMENT_SUCCESS',
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

function* searchTransactionSettlement(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('searchTransactionSettlement  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_TRANSACTION_SETTLEMENT_SUCCESS',
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

function* getBatchHistory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('getBatchHistory  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BATCH_HISTORY_SUCCESS',
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

function* searchBatchHistory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('searchBatchHistory  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_BATCH_HISTORY_SUCCESS',
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


function* changeStatustransaction(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('changeStatustransaction  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_INVOICE_BY_MERCHANT',
                method: 'GET',
                api: `${apiConfigs.BASE_API}checkout?page=1`,
                token: true,
                isShowLoading: true,
                currentPage: 1
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


function* settleBatch(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('settleBatch  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            // yield put({
            //     type: 'GET_LIST_INVOICE_BY_MERCHANT',
            //     method: 'GET',
            //     api: `${apiConfigs.BASE_API}checkout?page=1`,
            //     token: true,
            //     isShowLoading: true,
            //     currentPage: 1
            // })

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
        takeLatest('GET_LIST_INVOICE_BY_MERCHANT', getListInvoicesByMerchant),
        takeLatest('SEARCH_INVOICE', searchInvoice),
        takeLatest('GET_SETTLEMENT_WAITING', getSettlementWating),
        takeLatest('INVOICE_OFF_STAFF', invoicesOfStaff),
        takeLatest('GET_TRANSACTION_SETTLEMENT', getTransactionSettlement),
        takeLatest('SEARCH_TRANSACTION_SETTLEMENT', searchTransactionSettlement),
        takeLatest('GET_BATCH_HISTORY', getBatchHistory),
        takeLatest('SEARCH_BATCH_HISTORY', searchBatchHistory),
        takeLatest('CHANGE_STATUS_TRANSACTION', changeStatustransaction),
        takeLatest('SETTLE_BATCH', settleBatch),

    ])
}