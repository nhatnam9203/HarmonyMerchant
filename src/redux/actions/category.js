import Configs from '@configs';

export function addCategory(body, searchFilter = false) {
    return {
        type: 'ADD_CATEGORY',
        body,
        method: 'POST',
        token: true,
        api: `category`,
        searchFilter
    }
}

export function getCategoriesByMerchantId(name = '', status = '', type = '', searchFilter = false, isShowLoading = true) {
    return {
        type: 'GET_CATEGORIES_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `category/search?name=${name}&status=${status}&type=${type}`,
        isShowLoading,
        searchFilter
    }
}

export function archiveCategory(id, searchFilter = false) {
    return {
        type: 'ARCHIVE_CATEGORY',
        body: {},
        method: 'PUT',
        token: true,
        api: `category/archive/${id}`,
        searchFilter
    }
}

export function restoreCategory(id, searchFilter = false) {
    return {
        type: 'RESTORE_CATEGORY',
        body: {},
        method: 'PUT',
        token: true,
        api: `category/restore/${id}`,
        searchFilter
    }
}

export function editCategory(body, id, searchFilter = false) {
    return {
        type: 'EDIT_CATEGORY',
        body,
        method: 'PUT',
        token: true,
        api: `category/${id}`,
        searchFilter
    }
}

export function searchCategories(name = '', status = '', type = '') {
    return {
        type: 'SEARCH_CATEGORIES',
        method: 'GET',
        token: true,
        api: `category/search?name=${name}&status=${status}&type=${type}`
    }
}


export function clearSearchCategories() {
    return {
        type: 'CLEAR_SEARCH_CATEGORIES',
        payload: true
    }
}

export function updatePositionCategoriesLocal(data) {
    return {
        type: 'UPDATE_POSITION_CATEGORIES_LOCAL',
        payload: data
    }
}

export function updatePositionCategories(body) {
    return {
        type: 'UPDATE_POSITION_CATEGORIES',
        body,
        method: 'PUT',
        token: true,
        api: `category/update/position`,
    }
}

export function updateListCategoryLocal(data) {
    return {
        type: "UPDATE_LIST_CATEGORY_LOCAL",
        payload: data
    }
}
