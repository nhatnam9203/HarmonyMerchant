import apiConfigs from '../../configs/api';

export function getListInvoicesByMerchant(key = "", method = "", status = "", timeStart = "", timeEnd = "", quickFilter = "", page = 1, isShowLoading = true, isLoadMore = false) {
    return {
        type: 'GET_LIST_INVOICE_BY_MERCHANT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}checkout?page=${page}&method=${method}&status=${status}&timeStart=${timeStart}&timeEnd=${timeEnd}&key=${key}&quickFilter=${quickFilter}`,
        token: true,
        isShowLoading,
        currentPage: page,
        isLoadMore
    }
}

export function searchInvoice(urlSearch) {
    return {
        type: 'SEARCH_INVOICE',
        method: 'GET',
        api: `${apiConfigs.BASE_API}checkout/search?${urlSearch}`,
        token: true
    }
}

export function clearSearInvoice() {
    return {
        type: 'CLEAR_SEARCH_SERVICE'
    }
}

// ----------- Settle ------------

export function getSettlementWating(isShowLoading = true) {
    return {
        type: 'GET_SETTLEMENT_WAITING',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/waiting`,
        token: true,
        isShowLoading
    }
}

export function resetSettle() {
    return {
        type: 'RESET_SETTLE',
    }
}

export function invoicesOfStaff(staffId) {
    return {
        type: 'INVOICE_OFF_STAFF',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/checkoutbystaff/${staffId}`,
        token: true
    }
}

export function getTransactionSettlement(status = "", timeStart = "", timeEnd = "", key = "", quickFilter = "", isShowLoading = true) {
    return {
        type: 'GET_TRANSACTION_SETTLEMENT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/transaction?status=${status}&timeStart=${timeStart}&timeEnd=${timeEnd}&key=${key}&quickFilter=${quickFilter}`,
        token: true,
        isShowLoading
    }
}

export function searchTransactionSettlement(urlSearch) {
    return {
        type: 'SEARCH_TRANSACTION_SETTLEMENT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/transaction?${urlSearch}`,
        token: true
    }
}

export function clearSearTransaction() {
    return {
        type: 'CLEAR_SEARCH_TRANSACTION'
    }
}

export function getBatchHistory(key = "", timeStart = "", timeEnd = "", quickFilter = "", page = 1, isShowLoading = true, isShowLoadMore = false) {
    return {
        type: 'GET_BATCH_HISTORY',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/search?key=${key}&timeStart=${timeStart}&timeEnd=${timeEnd}&quickFilter=${quickFilter}&page=${page}`,
        token: true,
        isShowLoading,
        currentPage: page,
        isShowLoadMore
    }
}


export function clearSearchBatchHistory() {
    return {
        type: 'CLEAR_SEARCH_BATCH_HISTORRY'
    }
}

export function changeStatustransaction(checkoutId, params,responseData) {
    return {
        type: 'CHANGE_STATUS_TRANSACTION',
        method: 'PUT',
        body: {
            responseData:responseData
        },
        api: `${apiConfigs.BASE_API}checkout/paymentvoidrefundtransaction/${checkoutId}`,
        token: true,
        params
    }
}


export function settleBatch(body) {
    return {
        type: 'SETTLE_BATCH',
        method: 'POST',
        body,
        api: `${apiConfigs.BASE_API}settlement`,
        token: true
    }
}

export function resetStateIsGettingSettlement() {
    return {
        type: 'RESET_STATE_IS_GETTING_SETTLEMENT'
    }
}

export function togglPopupConfirmPrintInvoice(visible = false) {
    return {
        type: 'VISIBLE_POPUP_CONFIRM_PRINT_INVOICE',
        payload: visible
    }
}

export function updateSearchKeyword(keyword = "") {
    return {
        type: 'UPDATE_SEARCH_KEYWORD',
        payload: keyword
    }
}

export function updateBatchHistorySearchKeyword(keyword = "") {
    return {
        type: 'UPDATE_BATCH_HISTORY_SEARCH_KEYWORD',
        payload: keyword
    }
}

export function toggleInvoiceTabPermission(visible = true) {
    return {
        type: 'TOGGLE_INVOICE_TAB_PERMISSION',
        payload: visible
    }
}

export function toggleSettlementTabPermission(visible = true) {
    return {
        type: 'TOGGLE_SETTLEMENT_TAB_PERMISSION',
        payload: visible
    }
}

export function getSettlementWarning() {
    return {
        type: 'GET_SETTLEMENT_WARNING',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/warning`,
        token: true
    }
}

export function getListStaffsSales() {
    return {
        type: 'GET_LIST_STAFFS_SALES',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/staffSales`,
    }
}

export function getListGiftCardSales() {
    return {
        type: 'GET_LIST_GIFT_CARD_SALES',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}settlement/waiting/giftCardSales`,
    }
}



export function resetStateSettleBatch(keyword = "") {
    return {
        type: 'RESET_STATE_SETTLE_BATCH',
    }
}

export function toggleDisplayBackSettleIcon(visible = true) {
    return {
        type: 'TOOGLE_DISPLAY_BACK_SETTLE_ICON',
        payload: visible
    }
}

export function getStaffSalesBySettlementId(settlementId = 0) {
    return {
        type: 'GET_STAFF_SALES_BY_SETTLEMENT_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/staffSales/getBySettlement/${settlementId}`,
    }
}

export function getGiftCardSalesBySettlementId(settlementId = 0) {
    return {
        type: 'GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}settlement/giftCardSales/${settlementId}`,
    }
}

export function toggleDisplayBackBatchHistoryIcon(visible = true) {
    return {
        type: 'TOOGLE_DISPLAY_BACK_BATCH_HISTORY_ICON',
        payload: visible
    }
}
