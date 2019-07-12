import apiConfigs from '../../configs/api';

export function addCategory(body) {
    return {
        type: 'ADD_CATEGORY',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}category`,
    }
}

export function getCategoriesByMerchantId(isShowLoading = true) {
    return {
        type: 'GET_CATEGORIES_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}category`,
        isShowLoading
    }
}

export function archiveCategory(id) {
    return {
        type: 'ARCHIVE_CATEGORY',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}category/archive/${id}`,
    }
}

export function restoreCategory(id) {
    return {
        type: 'RESTORE_CATEGORY',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}category/restore/${id}`,
    }
}

export function editCategory(body, id) {
    return {
        type: 'EDIT_CATEGORY',
        body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}category/${id}`,
    }
}

export function searchCategories(name = '', status = '', type = '') {
    return {
        type: 'SEARCH_CATEGORIES',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}category/search?name=${name}&status=${status}&type=${type}`
    }
}


export function clearSearchCategories() {
    return {
        type: 'CLEAR_SEARCH_CATEGORIES',
        payload: true
    }
}

