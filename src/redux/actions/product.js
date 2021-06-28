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

export function getProductsByMerchant(name = "", category = "", isShowLoading = true) {
    return {
        type: 'GET_PRODUCTS_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/search?name=${name}&category=${category}`,
        isShowLoading
    }
}

export function searchProduct(name = '', category = '', status = '') {
    return {
        type: 'SEARCH_PRODUCT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/search?name=${name}&category=${category}`
    }
}

export function archiveProduct(id,keySearch = "",category ="") {
    return {
        type: 'ARCHIVE_PRODUCT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/archive/${id}`,
        keySearch,
        category
    }
}

export function restoreProduct(id,keySearch = "",category ="") {
    return {
        type: 'RESTORE_PRODUCT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/restore/${id}`,
        keySearch,
        category
    }
}

export function editProduct(body, id,keySearch = "",category ="") {
    return {
        type: 'EDIT_PRODUCT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/${id}`,
        keySearch,
        category
    }
}


export function clearSearchProduct() {
    return {
        type: 'CLEAR_SEARCH_PRODUCT',
        payload: true
    }
}


export function restockProduct(ids, quantity,keySearch = "",category ="") {
    return {
        type: 'RESTOCK_PRODUCT',
        body: {
            quantity,
            ids
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/restock`,
        keySearch,
        category
    }
}

export function exportInventory(merchantId, fileName, isNeedToOrder = true, type = "excel") {
    return {
        type: 'EXPORT_INVENTORY',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/export?merchantId=${merchantId}&isNeedToOrder=${isNeedToOrder}&type=${type}`,
        fileName,
        extention: type === "excel" ? "csv" : "pdf"
    }
}

export function resetDownloadFinleInventory() {
    return {
        type: 'RESET_DOWNLOAD_FILE_INVENTORY',
    }
}

export function updateProductsPositionLocal(data) {
    return {
        type: 'UPDATE_PRODUCTS_POSITION_LOCAL',
        payload: data
    }
}

export function updateProductsPosition(body) {
    return {
        type: 'UPDATE_PRODUCTS_POSITION',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}product/update/position`,
    }
}

export function checkSKUIsExist(sku) {
    return {
        type: 'CHECK_SKU_IS_EXIST',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/checksku?sku=${sku}`,
    }
}

export function toggleProductTabPermission(visible = true) {
    return {
        type: 'TOGGLE_PRODUCT_TAB_PERMISSION',
        payload: visible
    }
}

export function getProductByStaff(categoryId, callBack) {
    return {
        type: 'GET_PRODUCT_BY_STAFF',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}product/getbycategory/${categoryId}`,
        callBack
    }
}