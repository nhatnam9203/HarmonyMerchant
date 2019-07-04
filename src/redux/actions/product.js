import apiConfigs from '../../configs/api';

export function addProductByMerchant(body) {
    return {
        type: 'ADD_PRODUCR_BY_MERCHANT_ID',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}product`,
    }
}

export function getProductsByMerchant(isShowLoading= true) {
    return {
        type: 'GET_PRODUCTS_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product`,
        isShowLoading
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

export function editProduct(body, id) {
    return {
        type: 'EDIT_PRODUCT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/${id}`,
    }
}

export function searchProduct(name = '', category = '', status = '') {
    return {
        type: 'SEARCH_PRODUCT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/search?name=${name}&category=${category}&status=${status}`
    }
}

export function clearSearchProduct() {
    return {
        type: 'CLEAR_SEARCH_PRODUCT',
        payload: true
    }
}