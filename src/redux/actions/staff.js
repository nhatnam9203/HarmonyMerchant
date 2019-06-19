import apiConfigs from '../../configs/api';

export function addStaffByMerchant(body, id) {
    return {
        type: 'ADD_STAFF_BY_MERCHANT',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}staff`,
        merchantId: id
    }
}

export function getCategoriesByMerchantId(id) {
    return {
        type: 'GET_CATEGORIES_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}category/getbymerchant/${id}`
    }
}


