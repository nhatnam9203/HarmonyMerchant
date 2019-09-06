const initialState = {
    loading: false,
    generalInfo: '',
    businessInfo: '',
    bankInfo: '',
    principalInfo: '',
    visibleModalLock: false,
    timeOutLockScreen: 15 * 1000 * 60,
    question: [],
    isFlashScreen: true
}

function appReducer(state = initialState, action) {
    switch (action.type) {
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
                isFlashScreen: false
            }


        default:
            return state
    }
}

module.exports = appReducer;
