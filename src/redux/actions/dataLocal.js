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

