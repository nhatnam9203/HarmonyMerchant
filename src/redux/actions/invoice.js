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

export function searchInvoice(key, method, status, timeStart, timeEnd) {
    return {
        type: 'SEARCH_INVOICE',
        method: 'GET',
        api: `${apiConfigs.BASE_API}checkout/search?method=${method}&status=${status}&timeStart=${timeStart}&timeEnd=${timeEnd}&key=${key}`,
        token: true
    }
}

// export function clearSearCustomer() {
//     return {
//         type: 'CLEAR_SEARCH_CUSTOMER'
//     }
// }

// export function addCustomer(body) {
//     return {
//         type: 'ADD_CUSTOMER',
//         method: 'POST',
//         body,
//         api: `${apiConfigs.BASE_API}customer`,
//         token: true
//     }
// }

// export function editCustomer(id, body) {
//     return {
//         type: 'EDIT_CUSTOMER',
//         method: 'PUT',
//         body,
//         api: `${apiConfigs.BASE_API}customer/${id}`,
//         token: true
//     }
// }



