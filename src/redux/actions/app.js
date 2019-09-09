import apiConfigs from '../../configs/api';

// ---- Loading ----
export function loadingApp() {
    return {
        type: 'LOADING_ROOT',
    }
}

export function stopLoadingApp() {
    return {
        type: 'STOP_LOADING_ROOT',
    }
}

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
        api: `${apiConfigs.BASE_API}merchant`
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

export function handleLockScreen(visible) {
    return {
        type: 'HANDLE_LOCK_SCREEN',
        payload: visible
    }
}

export function getStateCity() {
    return {
        type: 'GET_STATE_CITY',
        method: 'GET',
        api: `${apiConfigs.BASE_API}state`
    }
}

export function getQuestion() {
    return {
        type: 'GET_QUESTION',
        method: 'GET',
        api: `${apiConfigs.BASE_API}question`
    }
}

export function merchantSetting(body) {
    return {
        type: 'MERCHANT_SETTING',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}merchant/setting`
    }
}

export function resetIsFlashScreen(){
    return{
        type :'RESET_IS_FLASH_SCREEN'
    }
}

