const initialState = {
    profile: {},
    token: false,
    stateCity: [],
    language: 'en',
    autoCloseAt: '',
    autoLockScreenAfter: 'Never',
    paxMachineInfo: {
        name: '',
        ip: '',
        port: '',
        timeout: 60000,
        isSetup: false
    },
    profileStaffLogin: {},
    isLoginStaff: false,
    listAppointmentsOfflineMode: [],
    deviceId: "",
    versionApp: "",
    checkEmailToResetPax: "",
    MIDStorage: "",
    isRememberMID: false
}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_ROOT':
            return action.payload.dataLocal
        case 'LOGIN_APP_SUCCESS':
            return {
                ...state,
                checkEmailToResetPax: action.payload,
                paxMachineInfo: state.checkEmailToResetPax && state.checkEmailToResetPax === action.payload ? state.paxMachineInfo : {
                    name: '',
                    ip: '',
                    port: '',
                    timeout: 60000,
                    isSetup: false
                },
                MIDStorage: action.isRememberMID ? action.payload : "",
            }
        case 'TOGGLE_SAVE_MID':
            return {
                ...state,
                isRememberMID: action.payload,
            }
        case 'UPDATE_AUTO_LOCK_TIME':
            return {
                ...state,
                autoLockScreenAfter: action.payload,
            }
        case 'SAVE_PROFILE_LOCAL':
            return {
                ...state,
                profile: action.payload.profile,
                token: action.payload.token ? action.payload.token : state.token,
            }
        case 'GET_MERCHANT_BY_ID_SUCCESS':
            return {
                ...state,
                profile: action.payload,
            }
        case 'CHANGE_SETTING_LOCAL_APP':
            return {
                ...state,
                language: action.payload.language,
                autoCloseAt: action.payload.autoCloseAt,
                // autoLockScreenAfter: action.payload.autoLockScreenAfter,
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
        case 'ADD_APPOINTMENT_OFFLINE_MODE':
            return {
                ...state,
                listAppointmentsOfflineMode: [...state.listAppointmentsOfflineMode, action.payload]
            }
        case 'SUBMIT_APPOINTMENT_OFFLINE_SUCCESS': {
            return {
                ...state,
                listAppointmentsOfflineMode: []
            }
        }
        case 'UPDATE_BUSSINES_HOUR': {
            return {
                ...state,
                profile: { ...state.profile, ...action.payload }
            }
        }
        case 'DELETE_HARDWARE':
            return {
                ...state,
                paxMachineInfo: {
                    name: '',
                    ip: '',
                    port: '',
                    timeout: 60000,
                    isSetup: false
                }
            }

        case "UPDATE_DEVICE_ID":
            return {
                ...state,
                deviceId: action.payload
            }
        case "UPDATE_VERSION_APP":
            return {
                ...state,
                versionApp: action.payload
            }

        default:
            return state
    }
}

module.exports = dataLocal;

