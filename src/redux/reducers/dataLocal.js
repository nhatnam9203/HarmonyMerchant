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
        timeout: 60000,
        isSetup: false
    },
    profileStaffLogin: {},
    isLoginStaff: false,
    listAppointmentsOfflineMode: [],
    deviceId: "",
    versionApp: ""

}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_ROOT':
            //console.log('action.payload.dataLocal : ',action.payload.dataLocal);
            return action.payload.dataLocal
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

