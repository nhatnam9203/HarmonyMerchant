import apiConfigs from '../../configs/api';

export function addProductByMerchantId(body, id) {
    return {
        type: 'ADD_PRODUCR_BY_MERCHANT_ID',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}category/add`,
        merchantId: id
    }
}

export function getProductsByMerchant() {
    return {
        type: 'GET_PRODUCTS_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product`
    }
}

export function archiveProduct(id) {
    return {
        type: 'ARCHIVE_PRODUCT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/archive/${id}`,
    }
}

export function restoreProduct(id) {
    return {
        type: 'RESTORE_PRODUCT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/restore/${id}`,
    }
}

