import apiConfigs from '../../configs/api';

export function getListInvoicesByMerchant(isShowLoading = true, page = 1) {
    return {
        type: 'GET_LIST_INVOICE_BY_MERCHANT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}checkout?page=${page}`,
        token: true,
        isShowLoading,
        currentPage: page
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

export function getSettlementWating() {
    return {
        type: 'GET_SETTLEMENT_WAITING',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/waiting`,
        token: true
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

export function getTransactionSettlement() {
    return {
        type: 'GET_TRANSACTION_SETTLEMENT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/transaction`,
        token: true
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

export function getBatchHistory() {
    return {
        type: 'GET_BATCH_HISTORY',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/search?from=&to=&key`,
        token: true
    }
}

export function searchBatchHistory(url) {
    return {
        type: 'SEARCH_BATCH_HISTORY',
        method: 'GET',
        api: `${apiConfigs.BASE_API}settlement/search?${url}`,
        token: true
    }
}

export function clearSearchBatchHistory() {
    return {
        type: 'CLEAR_SEARCH_BATCH_HISTORRY'
    }
}

export function changeStatustransaction(checkoutId) {
    return {
        type: 'CHANGE_STATUS_TRANSACTION',
        method: 'PUT',
        body: {},
        api: `${apiConfigs.BASE_API}checkout/paymentvoidrefundtransaction/${checkoutId}`,
        token: true
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

