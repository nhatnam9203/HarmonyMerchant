import apiConfigs from '../../configs/api';

export function getListCustomersByMerchant(key = "", page = 1, isShowLoading = true, isShowLoadMore = false) {
    return {
        type: 'GET_LIST_CUSTOMER_BY_MERCHANT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/search?key=${key}&page=${page}`,
        token: true,
        isShowLoading,
        currentPage: page,
        isShowLoadMore
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

export function editCustomer(id, body, keySearch = "") {
    return {
        type: 'EDIT_CUSTOMER',
        method: 'PUT',
        body,
        api: `${apiConfigs.BASE_API}customer/${id}`,
        token: true,
        keySearch,
        customerId:id
    }
}

export function getCustomerInfoByPhone(phone) {
    return {
        type: 'GET_CUSTOMER_INFO_BY_PHONE',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/getbyphone/${phone}`,
        token: true
    }
}

export function toggleCustomerTabPermission(visible = true) {
    return {
        type: 'TOGGLE_CUSTOMER_TAB_PERMISSION',
        payload: visible
    }
}

export function sendGoogleReviewLink(customerId = 0, merchantId = 0) {
    return {
        type: 'SEND_GOOGLE_REVIEW_LIINK',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/sendReviewLink?customerId=${customerId}&merchantId=${merchantId}`,
        token: true
    }
}

export function getCustomerInfoById(customerId) {
    return {
        type: 'GET_CUSTOMER_INFO_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/${customerId}`,
        token: true
    }
}

export function getPastAppointments(customerId, page = 1) {
    return {
        type: 'GET_PAST_APPOINTMENT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/getPastByCustomer/${customerId}?page=${page}`,
        token: true
    }
}


export function resetIsGetCustomerInfoByIdState(visible = false) {
    return {
        type: 'RESET_IS_GET_CUSTOMER_INFO_BY_ID_STATE',
        payload: visible
    }
}
