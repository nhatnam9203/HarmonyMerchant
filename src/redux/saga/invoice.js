import { put, takeLatest, all, select } from 'redux-saga/effects';

import Configs from '@configs';
import { requestAPI } from '../../utils';

function* getListInvoicesByMerchant(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: 'LOADING_ROOT' });
    }
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_LIST_INVOICE_BY_MERCHANT_SUCCESS',
        payload: responses.data,
        totalPages: responses?.pages || 0,
        currentPage: action.currentPage,
      });

      if (action.isShowPopupConfirmPrintInvoice) {
        yield put({
          type: 'VISIBLE_POPUP_CONFIRM_PRINT_INVOICE',
          payload: true,
        });
      }
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({ type: 'GET_LIST_INVOICE_BY_MERCHANT_FAIL' });
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: 'GET_LIST_INVOICE_BY_MERCHANT_FAIL' });
    yield put({ type: error });
  } finally {
    yield put({ type: 'STOP_LOADING_ROOT' });
  }
}

function* searchInvoice(action) {
  try {
    yield put({ type: 'LOADING_ROOT' });
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'SEARCH_INVOICE_SUCCESS',
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    if (action.isShowLoading) {
      yield put({ type: 'LOADING_ROOT' });
    }
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_SETTLEMENT_WAITING_SUCCESS',
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'GET_SETTLEMENT_WAITING_FAIL',
      });
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({
      type: 'GET_SETTLEMENT_WAITING_FAIL',
    });
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
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'INVOICE_OFF_STAFF_SUCCESS',
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: 'STOP_LOADING_ROOT' });
  }
}

function* getTransactionSettlement(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: 'LOADING_ROOT' });
    }
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_TRANSACTION_SETTLEMENT_SUCCESS',
        payload: responses.data,
        totalPages: responses?.pages || 0,
        currentPage: action?.currentPage || 0,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'GET_TRANSACTION_SETTLEMENT_FAIL',
      });
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({
      type: 'GET_TRANSACTION_SETTLEMENT_FAIL',
    });
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
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'SEARCH_TRANSACTION_SETTLEMENT_SUCCESS',
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: 'STOP_LOADING_ROOT' });
  }
}

function* getBatchHistory(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: 'LOADING_ROOT' });
    }
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_BATCH_HISTORY_SUCCESS',
        payload: responses.data,
        totalPages: responses?.pages || 0,
        currentPage: action.currentPage,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'GET_BATCH_HISTORY_FAIL',
      });
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({
      type: 'GET_BATCH_HISTORY_FAIL',
    });
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
    const temptAction = profileLoginInvoice?.token
      ? { ...action, token: profileLoginInvoice?.token || '' }
      : action;
    const responses = yield requestAPI(temptAction);
    // console.log('------ changeStatustransaction: ', JSON.stringify(responses));
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_LIST_INVOICE_BY_MERCHANT',
        method: 'GET',
        api: `${Configs.API_URL}checkout?${action?.params || 'page=1'}`,
        token: true,
        isShowLoading: true,
        currentPage: 1,
        isShowPopupConfirmPrintInvoice: true,
      });
      //  ----- update invoice detail ------- //
      yield put({
        type: 'GET_INVOICE_DETAIL',
        method: 'GET',
        token: true,
        api: `${Configs.API_URL}checkout/${action?.checkoutId}`,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_SETTLEMENT_WAITING',
        method: 'GET',
        api: `${Configs.API_URL}settlement/waiting`,
        token: true,
        isShowLoading: true,
      });
      yield put({
        type: 'GET_LIST_STAFFS_SALES',
        method: 'GET',
        token: true,
        api: `${Configs.API_URL}appointment/staffSales`,
      });
      yield put({
        type: 'GET_LIST_GIFT_CARD_SALES',
        method: 'GET',
        token: true,
        api: `${Configs.API_URL}settlement/waiting/giftCardSales`,
      });
      yield put({
        type: 'SETTLE_BATCH_SUCCESS',
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
      yield put({
        type: 'SETTLE_BATCH_FAIL',
      });
    }
  } catch (error) {
    yield put({ type: error });
    yield put({
      type: 'SETTLE_BATCH_FAIL',
    });
  } finally {
    yield put({ type: 'STOP_LOADING_ROOT' });
  }
}

function* getSettlementWarning(action) {
  try {
    yield put({ type: 'LOADING_ROOT' });
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_LIST_STAFFS_SALES_SUCCESS',
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_LIST_GIFT_CARD_SALES_SUCCESS',
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_STAFF_SALES_BY_SETTLEMENT_ID_SUCCESS',
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID_SUCCESS',
        payload: responses?.data || [],
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: 'STOP_LOADING_ROOT' });
  }
}

function* getInvoiceDetail(action) {
  try {
    yield put({ type: 'LOADING_ROOT' });
    const responses = yield requestAPI(action);
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_INVOICE_DETAIL_SUCCESS',
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: 'STOP_LOADING_ROOT' });
  }
}

function* getCreditBatchDetailById(action) {
  try {
    yield put({ type: 'LOADING_ROOT' });
    const responses = yield requestAPI(action);
    // console.log('------ getCreditBatchDetailById: ',JSON.stringify(responses));
    yield put({ type: 'STOP_LOADING_ROOT' });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: 'GET_CREDIT_BATCH_DETAIL_BY_ID_SUCCESS',
        payload: responses?.data || {},
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: 'UNAUTHORIZED',
      });
    } else {
      yield put({
        type: 'SHOW_ERROR_MESSAGE',
        message: responses?.message,
      });
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
    takeLatest(
      'GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID',
      getGiftCardSalesBySettlementId
    ),
    takeLatest('GET_INVOICE_DETAIL', getInvoiceDetail),
    takeLatest('GET_CREDIT_BATCH_DETAIL_BY_ID', getCreditBatchDetailById),
  ]);
}
