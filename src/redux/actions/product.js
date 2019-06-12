import apiConfigs from '../../configs/api';

export function addProductByMerchantId(body, id) {
    return {
        type: 'ADD_CATEGORY',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}category/add`,
        merchantId: id
    }
}

export function getProductsByMerchantId(id) {
    return {
        type: 'GET_PRODUCTS_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/getbymerchantid/${id}`
    }
}


