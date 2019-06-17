import apiConfigs from '../../configs/api';

export function getMerchantByID(id) {
    return {
        type: 'GET_MERCHANT_BY_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchant/${id}`
    }
}

export function registerUser(body) {
    return {
        type: 'REGISTER_USER',
        method: 'POST',
        body,
        api: `${apiConfigs.BASE_API}merchant/add`
    }
}

export function setGeneralInfo(payload) {
    return {
        type: 'SET_GENERAL_INFO',
        payload
    }
}

export function setBusinessInfo(payload) {
    return {
        type: 'SET_BUSINESS_INFO',
        payload
    }
}

export function setBankInfo(payload) {
    return {
        type: 'SET_BANK_INFO',
        payload
    }
}

export function setPrincipalInfo(payload) {
    return {
        type: 'SET_PRINCIPAL_INFO',
        payload
    }
}

export function handleLockScreen(visible){
    return{
        type:'HANDLE_LOCK_SCREEN',
        payload: visible
    }
}
