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

export function getExtraByMerchant() {
    return {
        type: 'GET_EXTRA_BY_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}extra`
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

export function editCategory(body, id) {
    return {
        type: 'EDIT_CATEGORY',
        body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}category/${id}`,
    }
}
