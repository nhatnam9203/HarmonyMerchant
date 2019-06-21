import apiConfigs from '../../configs/api';

export function addStaffByMerchant(body, id) {
    return {
        type: 'ADD_STAFF_BY_MERCHANT',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}staff`,
        merchantId: id
    }
}

export function createAdmin(body) {
    return {
        type: 'CREATE_ADMIN',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}staff`,
    }
}

export function getStaffByMerchantId() {
    return {
        type: 'GET_STAFF_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}staff`
    }
}

export function searchStaffByName(name) {
    return {
        type: 'SEARCH_STAFF_BY_NAME',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}staff/byname/${name}`
    }
}

export function switchAddStaff(isAddStaff) {
    return {
        type: 'SWICH_ADD_STAFF',
        payload: isAddStaff
    }
}

export function clearSearch() {
    return {
        type: 'CLEAR_SEARCH',
        payload: true
    }
}


export function archiveStaff(id) {
    return {
        type: 'ARCHICVE_STAFF',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}active/${id}`
    }
}



