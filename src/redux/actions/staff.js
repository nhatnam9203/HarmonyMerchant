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

export function getStaffByMerchantId(id, name = '', role = '', status = '') {
    return {
        type: 'GET_STAFF_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}staff/getbymerchant/id=${id}&name=${name}&role=${role}=&status=${status}`
    }
}

export function searchStaffByName(name) {
    return {
        type: 'GET_STAFF_BY_MERCHANR_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}staff/getbymerchant/${id}`
    }
}


