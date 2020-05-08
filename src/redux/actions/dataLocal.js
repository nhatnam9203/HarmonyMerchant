export function updateProfile(profile) {
    return {
        type: 'UPDATE_PROFILE_SOCKET',
        payload: profile
    }
}

export function clearProfileLocal() {
    return {
        type: 'CLEAR_PROFILE_LOCAL',
        payload: {}
    }
}

export function saveTokenFCM(payload) {
    return {
        type: 'SAVE_TOKEN_FCM',
        payload
    }
}

export function changeSettingLocal(language, autoLockScreenAfter, autoCloseAt) {
    return {
        type: 'CHANGE_SETTING_LOCAL_APP',
        payload: {
            language: language,
            autoLockScreenAfter: autoLockScreenAfter,
            autoCloseAt: autoCloseAt
        }
    }
}


export function setupPaxMachine(paxInfo) {
    return {
        type: 'SETUP_PAX_MACHINE',
        payload: paxInfo
    }
}

export function resetStateLoginStaff(flag = false){
    return{
        type :'RESET_STATE_LOGIN_STAFF',
        payload :flag
    }
}


export function resetNeddSettingStore(){
    return{
        type :'RESET_NEED_SETTING_STORE',
    }
}

export function addAppointmentOfflineMode(body) {
    return {
        type: 'ADD_APPOINTMENT_OFFLINE_MODE',
        payload: body
    }
}

export function updateBusinessHour(data) {
    return {
        type: 'UPDATE_BUSSINES_HOUR',
        payload: data
    }
}

export function updateDeviceId(uniqueId) {
    return {
        type: 'UPDATE_DEVICE_ID',
        payload: uniqueId
    }
}