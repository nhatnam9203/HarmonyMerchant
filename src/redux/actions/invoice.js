import apiConfigs from '../../configs/api';

export function getListInvoicesByMerchant(isShowLoading = true) {
    return {
        type: 'GET_LIST_INVOICE_BY_MERCHANT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}checkout`,
        token: true,
        isShowLoading
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
