import { put, takeLatest, all, select } from "redux-saga/effects";

import apiConfigs from '../../configs/api';
import { requestAPI } from '../../utils';

function* getListInvoicesByMerchant(action) {
    try {
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        // console.log('getListInvoicesByMerchant : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_INVOICE_BY_MERCHANT_SUCCESS',
                payload: responses.data,
                totalPages: responses.pages,
                currentPage: action.currentPage
            });

            if (action.isShowPopupConfirmPrintInvoice) {
                yield put({
                    type: "VISIBLE_POPUP_CONFIRM_PRINT_INVOICE",
                    payload: true
                })
            }

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({ type: 'GET_LIST_INVOICE_BY_MERCHANT_FAIL' });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: 'GET_LIST_INVOICE_BY_MERCHANT_FAIL' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchInvoice(action) {
    //console.log(action)
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('searchInvoice : ', responses);
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('getSettlementWating  : ', responses);
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('getSettlementWating  : ', responses);
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
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('getTransactionSettlement  : ' + JSON.stringify(responses.data));
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
                type: 'GET_TRANSACTION_SETTLEMENT_FAIL',
            })
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({
            type: 'GET_TRANSACTION_SETTLEMENT_FAIL',
        })
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchTransactionSettlement(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('searchTransactionSettlement  : ' + JSON.stringify(responses));
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
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('getBatchHistory  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BATCH_HISTORY_SUCCESS',
                payload: responses.data,
                totalPages: responses.pages,
                currentPage: action.currentPage
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'GET_BATCH_HISTORY_FAIL',
            })
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({
            type: 'GET_BATCH_HISTORY_FAIL',
        })
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* changeStatustransaction(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const state = yield select();
        const { profileLoginInvoice } = state.dataLocal;
        const temptAction = { ...action, token: profileLoginInvoice.token ? profileLoginInvoice.token : "" };
        // console.log("---- temptAction: ", temptAction);
        const responses = yield requestAPI(temptAction);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('changeStatustransaction  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_LIST_INVOICE_BY_MERCHANT',
                method: 'GET',
                api: `${apiConfigs.BASE_API}checkout?${action.params ? action.params : "page=1"}`,
                token: true,
                isShowLoading: true,
                currentPage: 1,
                isShowPopupConfirmPrintInvoice: true
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
        // console.log("--Error: ", error);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* settleBatch(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('settleBatch  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_SETTLEMENT_WAITING',
                method: 'GET',
                api: `${apiConfigs.BASE_API}settlement/waiting`,
                token: true,
                isShowLoading: true
            });
            yield put({
                type: 'GET_LIST_STAFFS_SALES',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}appointment/staffSales`,
            });
            yield put({
                type: 'GET_LIST_GIFT_CARD_SALES',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}settlement/waiting/giftCardSales`,
            });
            yield put({
                type: "SETTLE_BATCH_SUCCESS"
            });


        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            });
            yield put({
                type: "SETTLE_BATCH_FAIL"
            })
        }
    } catch (error) {
        yield put({ type: error });
        yield put({
            type: "SETTLE_BATCH_FAIL"
        })
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getSettlementWarning(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('getSettlementWarning  : ' + JSON.stringify(responses));
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


function* getListStaffsSales(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('getListStaffsSales  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_LIST_STAFFS_SALES_SUCCESS",
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

function* getListGiftCardSales(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('getListGiftCardSales  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_LIST_GIFT_CARD_SALES_SUCCESS",
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

function* getStaffSalesBySettlementId(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('getStaffSalesBySettlementId  : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_STAFF_SALES_BY_SETTLEMENT_ID_SUCCESS",
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

function* getGiftCardSalesBySettlementId(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('getGiftCardSalesBySettlementId  : ' + JSON.stringify(responses));
        // console.log("---- data : ", responses.data.length);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID_SUCCESS",
                payload: responses.data ? responses.data : []
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

export default function* saga() {
    yield all([
        takeLatest('GET_LIST_INVOICE_BY_MERCHANT', getListInvoicesByMerchant),
        takeLatest('SEARCH_INVOICE', searchInvoice),
        takeLatest('GET_SETTLEMENT_WAITING', getSettlementWating),
        takeLatest('INVOICE_OFF_STAFF', invoicesOfStaff),
        takeLatest('GET_TRANSACTION_SETTLEMENT', getTransactionSettlement),
        takeLatest('SEARCH_TRANSACTION_SETTLEMENT', searchTransactionSettlement),
        takeLatest('GET_BATCH_HISTORY', getBatchHistory),
        takeLatest('CHANGE_STATUS_TRANSACTION', changeStatustransaction),
        takeLatest('SETTLE_BATCH', settleBatch),
        takeLatest('GET_SETTLEMENT_WARNING', getSettlementWarning),
        takeLatest('GET_LIST_STAFFS_SALES', getListStaffsSales),
        takeLatest('GET_LIST_GIFT_CARD_SALES', getListGiftCardSales),
        takeLatest('GET_STAFF_SALES_BY_SETTLEMENT_ID', getStaffSalesBySettlementId),
        takeLatest('GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID', getGiftCardSalesBySettlementId),
    ])
}