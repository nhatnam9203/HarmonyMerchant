import apiConfigs from '../../configs/api';

export function getListCustomersByMerchant(isShowLoading = true) {
    return {
        type: 'GET_LIST_CUSTOMER_BY_MERCHANT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/bymerchant`,
        token: true,
        isShowLoading
    }
}


export function searchCustomer(key) {
    return {
        type: 'SEARCH_CUSTOMER',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/search?key=${key}`,
        token: true
    }
}

export function clearSearCustomer() {
    return {
        type: 'CLEAR_SEARCH_CUSTOMER'
    }
}

export function addCustomer(body) {
    return {
        type: 'ADD_CUSTOMER',
        method: 'POST',
        body,
        api: `${apiConfigs.BASE_API}customer`,
        token: true
    }
}


