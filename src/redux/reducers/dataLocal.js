const initialState = {
    profile: {},
    token: false,
    stateCity: [],
    language: 'en',
    autoCloseAt: '',
    autoLockScreenAfter: '15:00 min',
    paxMachineInfo: {
        name: '',
        ip: '',
        port: '',
        timeout: '',
        isSetup: false
    },
    profileStaffLogin: {},
    isLoginStaff: false

}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_PROFILE_LOCAL':
            return {
                ...state,
                profile: action.payload.profile,
                token: action.payload.token,
            }
        case 'CHANGE_SETTING_LOCAL_APP':
            return {
                ...state,
                language: action.payload.language,
                autoCloseAt: action.payload.autoCloseAt,
                autoLockScreenAfter: action.payload.autoLockScreenAfter,
            }
        case 'GET_STATE_CITY_SUCCESS':
            return {
                ...state,
                stateCity: action.payload
            }
        case 'UPDATE_MERCHANT_PROFILE':
            return {
                ...state,
                profile: action.payload
            }
        case 'UPDATE_PROFILE_STAFF_SUCCESS':
            return {
                ...state,
                profileStaffLogin: action.payload,
                isLoginStaff: true
            }
        case 'RESET_NEED_SETTING_STORE':
            return {
                ...state,
                profile: { ...state.profile, needSetting: false },
            }
        case 'RESET_STATE_LOGIN_STAFF':
            return {
                ...state,
                isLoginStaff: false
            }
        case 'SETUP_PAX_MACHINE':
            return {
                ...state,
                paxMachineInfo: action.payload
            }
        case 'LOGOUT_APP':
            return {
                ...state,
                profile: {},
                profileStaffLogin: {},
                token: false,
            }

        default:
            return state
    }
}

module.exports = dataLocal;

