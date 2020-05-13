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

export function getProductsByMerchant(isShowLoading = true) {
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


export function restockProduct(ids, quantity) {
    return {
        type: 'RESTOCK_PRODUCT',
        body: {
            quantity,
            ids
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}product/restock`,
    }
}

export function exportInventory(merchantId, fileName,isNeedToOrder = true,type = "excel") {
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
