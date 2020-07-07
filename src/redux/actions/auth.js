import apiConfigs from '../../configs/api';

export function login(email, password, isRememberMID = false) {
    return {
        type: 'LOGIN_APP',
        body: {
            email: email,
            password: password,
        },
        method: 'POST',
        api: `${apiConfigs.BASE_API}merchant/login`,
        isRememberMID
    }
}

export function logout() {
    return {
        type: 'LOGOUT_APP',
    }
}


export function forgotPassword(email) {
    return {
        type: 'FORGOT_PASSWORD',
        method: 'GET',
        api: `${apiConfigs.BASE_API}merchant/forgotpassword/?email=${email}`,
        email
    }
}

export function checkStaffPermission(merchantCode, staffPin, tabName = "Invoice") {
    // console.log("---- tabName :  ",tabName);
    return {
        type: 'CHECK_STAFF_PERMISSION',
        body: {
            merchantCode,
            staffPin
        },
        method: 'POST',
        api: `${apiConfigs.BASE_API}staff/login/checkpermission?tab=${tabName}`,
        tabName

    }
}

export function toggleVisiblePopupCheckStaffPermission(visible = true) {
    return {
        type: 'TOGGLE_VISIBLE_POPUP_CHECK_STAFF_PERMISSION',
        payload: visible
    }
}