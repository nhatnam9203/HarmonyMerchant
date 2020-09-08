import apiConfigs from '../../configs/api';

export function addExtraByMerchant(body) {
    return {
        type: 'ADD_EXTRA_BY_MERCHANT',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}extra`,
    }
}

export function getExtraByMerchant(name = '', status = '',isShowLoading = true) {
    return {
        type: 'GET_EXTRA_BY_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}extra/search?name=${name}&status=${status}`,
        isShowLoading
    }
}

export function searchExtra(name = '', status = '') {
    return {
        type: 'SEARCH_EXTRA',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}extra/search?name=${name}&status=${status}`
    }
}

export function archiveExtra(id) {
    return {
        type: 'ARCHIVE_EXTRA',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}extra/archive/${id}`,
    }
}

export function restoreExtra(id) {
    return {
        type: 'RESTORE_EXTRA',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}extra/restore/${id}`,
    }
}

export function editExtra(body, id) {
    return {
        type: 'EDIT_EXTRA',
        body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}extra/${id}`,
    }
}


export function clearSearchExtra() {
    return {
        type: 'CLEAR_SEARCH_EXTRA',
        payload: true
    }
}

export function updatePositionExtrasLocal(data){
    return {
        type : 'UPDATE_POSITION_EXTRAS_LOCAL',
        payload:data
    }
}

export function updatePositionExtras(body) {
    return {
        type: 'UPDATE_POSITION_EXTRAS',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}extra/update/position`
    }
}