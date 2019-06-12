import apiConfigs from '../../configs/api';

export function addCategory(body,id) {
    return {
        type: 'ADD_CATEGORY',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}category/add`,
        merchantId:id
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


