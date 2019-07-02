import apiConfigs from '../../configs/api';

export function addServiceByMerchant(body) {
    return {
        type: 'ADD_SERVICE_BY_MERCHANT',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}service`,
    }
}

export function getServicesByMerchant() {
    return {
        type: 'GET_SERVICE_BY_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}service`
    }
}

export function archiveService(id) {
    return {
        type: 'ARCHIVE_SERVICE',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}service/archive/${id}`,
    }
}

export function restoreService(id) {
    return {
        type: 'RESTORE_SERVICE',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}service/restore/${id}`,
    }
}

export function editService(body, id) {
    return {
        type: 'EDIT_SERVICE',
        body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}service/${id}`,
    }
}

export function searchService(name = '', category = '', status = '') {
    return {
        type: 'SEARCH_SERVICE',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}service/search?name=${name}&category=${category}&status=${status}`
    }
}

export function clearSearchService() {
    return {
        type: 'CLEAR_SEARCH_SERVICE',
        payload: true
    }
}