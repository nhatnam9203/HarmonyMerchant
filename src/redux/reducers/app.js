const initialState = {
    loading: false,
    generalInfo: '',
    businessInfo: '',
    bankInfo: '',
    principalInfo: '',
    visibleModalLock: false,
    timeOutLockScreen: 15 * 1000 * 60,
    question: [],
    isFlashScreen: true,

    visibleEnterPin: true,
    isSubmitTax: false,
    visibleEnterPinInvoice: false,
    isOfflineMode: false,
    isAgreeTerm: false,
    visibleDisconnect: false,
    visibleConnected: false,
    isReloadWebview: false,
    // MIDStorage: "",
    packageAndPricingData: [],
    refreshingGeneral: false,
    connectPAXStatus: {
        status: true,
        message: "is connecting to Pax machine ....",
    },
    isUpdateMerchantSetting: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'MERCHANT_SETTING':
            return {
                ...state,
                isUpdateMerchantSetting: false,
            }
        case 'MERCHANT_SETTING_SUCCESS':
            return {
                ...state,
                isUpdateMerchantSetting: true,
            }
        case 'MERCHANT_SETTING_FAIL':
            return {
                ...state,
                isUpdateMerchantSetting: false,
            }
        case 'RESET_STATE_UPDATE_MERCHANT_SETTING':
            return {
                ...state,
                isUpdateMerchantSetting: false,
            }
        case 'AGREE_TERM':
            return {
                ...state,
                isAgreeTerm: action.payload
            }
        case 'RESET_AGREE_TERM':
            return {
                ...state,
                isAgreeTerm: false
            }
        case 'LOADING_ROOT':
            return {
                ...state,
                loading: true
            }
        case 'STOP_LOADING_ROOT':
            return {
                ...state,
                loading: false
            }
        case 'SET_GENERAL_INFO':
            return {
                ...state,
                generalInfo: action.payload
            }
        case 'SET_BUSINESS_INFO':
            return {
                ...state,
                businessInfo: action.payload
            }
        case 'SET_BANK_INFO':
            return {
                ...state,
                bankInfo: action.payload
            }
        case 'SET_PRINCIPAL_INFO':
            return {
                ...state,
                principalInfo: action.payload
            }

        case 'HANDLE_LOCK_SCREEN':
            return {
                ...state,
                visibleModalLock: action.payload
            }
        case 'GET_QUESTION_SUCCESS':
            return {
                ...state,
                question: action.payload
            }
        case 'GET_QUESTION_FAIL':
            return {
                ...state,
                question: []
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                loading: false
            }
        case 'TIME_OUT':
            return {
                ...state,
                loading: false
            }

        case 'RESET_IS_FLASH_SCREEN':
            return {
                ...state,
                isFlashScreen: action.payload
            }
        case 'CHANGE_FLAG_VISIBLE_ENTER_PIN_CODE':
            return {
                ...state,
                visibleEnterPin: action.payload
            }
        case 'CHANGE_FLAG_SUBMIT_TAX':
            return {
                ...state,
                isSubmitTax: action.payload
            }
        case 'LOGIN_STAFF_SUCCESS':
            return {
                ...state,
                visibleEnterPinInvoice: action.isPincodeInvoice ? false : state.visibleEnterPinInvoice
            }
        case "CHECK_STAFF_PERMISSION_SUCCESS":
            return {
                ...state,
                visibleEnterPinInvoice: false
            }
        case 'SET_VISIBLE_ENTER_CODE_INVOICE':
            return {
                ...state,
                visibleEnterPinInvoice: action.payload
            }

        case 'CLOSE_POPUP_ENTER_PIN':
            return {
                ...state,
                visibleEnterPin: false
            }
        case 'SHOW_POP_UP_DISCONNECTED':
            return {
                ...state,
                visibleDisconnect: action.payload
            }
        case 'SHOW_POP_UP_CONNECTED':
            return {
                ...state,
                visibleConnected: action.payload,
                isReloadWebview: !action.payload ? true : state.isReloadWebview
            }
        case 'RESET_STATE_RELOAD_WEBVIEW':
            return {
                ...state,
                isReloadWebview: false
            }
        case 'SUBMIT_APPOINTMENT_OFFLINE_SUCCESS':
            return {
                ...state,
                isReloadWebview: true
            }
        case 'TURN_ON_OFFLINE_MODE':
            return {
                ...state,
                visibleDisconnect: false
            }
        case 'GET_PACKAGE_AND_PRICING_SUCCESS':
            return {
                ...state,
                packageAndPricingData: action.payload ? action.payload : []
            }

        case 'GET_MERCHANT_BY_ID':
            return {
                ...state,
                refreshingGeneral: action.isRefresh
            }
        case 'GET_MERCHANT_BY_ID_SUCCESS':
            return {
                ...state,
                refreshingGeneral: false
            }
        case 'GET_MERCHANT_BY_ID_FAIL':
            return {
                ...state,
                refreshingGeneral: false
            }
        case 'CONNECT_PAX_MACHINE_ERROR':
            return {
                ...state,
                connectPAXStatus: {
                    status: false,
                    message: `( Your POS system don't have connect to PAX machine. Error : "${action.payload}" )`
                }
            }
        case 'CONNECT_PAX_MACHINE_SUCCESS':
            return {
                ...state,
                connectPAXStatus: {
                    status: true,
                    message: "( Connect to PAX machine success! )"
                }
            }
        default:
            return state
    }
}

module.exports = appReducer;
