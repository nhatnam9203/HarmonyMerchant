import apiConfigs from '../../configs/api';

export function addCategory(body, id) {
    return {
        type: 'ADD_CATEGORY',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}category`,
        merchantId: id
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

export function archiveCategory(id) {
    return {
        type: 'ARCHIVE_CATEGORY',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}category/archive/${id}`,
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
