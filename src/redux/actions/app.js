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

export function resetIsFlashScreen(isFocus = false) {
    return {
        type: 'RESET_IS_FLASH_SCREEN',
        payload: isFocus
    }
}

export function changeFlagVisibleEnteerPinCode(visible = true) {
    return {
        type: 'CHANGE_FLAG_VISIBLE_ENTER_PIN_CODE',
        payload: visible
    }
}

export function sendLinkInstallApp(phone) {
    return {
        type: 'SEND_LINK_INSTALL_APP',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}user/sendlink?phone=${phone}`
    }
}


export function setupMerchantTAX(body) {
    return {
        type: 'SETUP_MERCHANT_TAX',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}merchant/setting`
    }
}

export function changeFlagSubmitTAX(visible = true) {
    return {
        type: 'CHANGE_FLAG_SUBMIT_TAX',
        payload: visible
    }
}

export function checkEmailSignup(email) {
    return {
        type: 'CHECK_EMAIL_SIGN_UP',
        method: 'GET',
        // token: true,
        api: `${apiConfigs.BASE_API}merchant/checkEmail?email=${email}`
    }
}

export function showMessageError(message) {
    return {
        type: 'SHOW_ERROR_MESSAGE',
        message: message
    }
}

export function catchError(type) {
    return {
        type: type,
    }
}

export function setVisibleEnterPincodeInvoice(visible = true) {
    return {
        type: 'SET_VISIBLE_ENTER_CODE_INVOICE',
        payload: visible
    }
}

export function toogleOfflineMode(visible = true) {
    return {
        type: 'TURN_ON_OFFLINE_MODE',
        typeNetwork: 'TURN_ON_OFFLINE_MODE',
        payload: visible
    }
}


export function closePopupEnterPin() {
    return {
        type: 'CLOSE_POPUP_ENTER_PIN',
    }
}


export function agreeTerm(visible = true) {
    return {
        type: 'AGREE_TERM',
        payload: visible
    }
}

