import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  loading: false,
  generalInfo: '',
  businessInfo: '',
  bankInfo: '',
  principalInfo: '',
  registerMerchantError: false,
  selectPackageAndPricing: {
    pricingType: 'annualy',
    packagePricing: 0,
  },
  visibleModalLock: false,
  question: [],
  isFlashScreen: true,
  visibleEnterPin: false, // ----------- True ----------
  isSubmitTax: false,
  visibleEnterPinInvoice: false,
  isOfflineMode: false,
  isAgreeTerm: false,
  visibleDisconnect: false,
  visibleConnected: false,
  isReloadWebview: false,
  packageAndPricingData: [],
  refreshingGeneral: false,
  connectPAXStatus: {
    status: true,
    message: 'is connecting to Pax machine ....',
  },
  isUpdateMerchantSetting: false,
  settingTabPermission: false,
  visiblePopupCodePush: false,
  descriptionCodePush: '',
  isInitialApp: true,
  terminalID: '',
  isHandleNotiWhenHaveAAppointment: false,
  notiIntervalId: false,
  notificationList: [],
  notificationContUnread: 0,
  notiTotalPages: 0,
  notiCurrentPage: 0,

  currentAppMode: 'POS',
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'MERCHANT_SETTING':
      return {
        ...state,
        isUpdateMerchantSetting: false,
      };
    case 'REGISTER_USER':
      return {
        ...state,
        registerMerchantError: false,
      };
    case 'REGISTER_USER_SUCCESS':
      return {
        ...state,
        registerMerchantError: false,
      };
    case 'REGISTER_USER_FAIL':
      return {
        ...state,
        registerMerchantError: true,
      };
    case 'RESET_STATE_REGISTER_MERCHANT_ERROR':
      return {
        ...state,
        registerMerchantError: false,
      };
    case 'MERCHANT_SETTING_SUCCESS':
      return {
        ...state,
        isUpdateMerchantSetting: true,
      };
    case 'MERCHANT_SETTING_FAIL':
      return {
        ...state,
        isUpdateMerchantSetting: false,
      };
    case 'RESET_STATE_UPDATE_MERCHANT_SETTING':
      return {
        ...state,
        isUpdateMerchantSetting: false,
      };
    case 'AGREE_TERM':
      return {
        ...state,
        isAgreeTerm: action.payload,
      };
    case 'RESET_AGREE_TERM':
      return {
        ...state,
        isAgreeTerm: false,
      };
    case 'LOADING_ROOT':
      return {
        ...state,
        loading: true,
      };
    case 'STOP_LOADING_ROOT':
      return {
        ...state,
        loading: false,
      };
    case 'SET_GENERAL_INFO':
      return {
        ...state,
        generalInfo: action.payload,
      };
    case 'SET_BUSINESS_INFO':
      return {
        ...state,
        businessInfo: action.payload,
      };
    case 'SET_BANK_INFO':
      return {
        ...state,
        bankInfo: action.payload,
      };
    case 'SET_PRINCIPAL_INFO':
      return {
        ...state,
        principalInfo: action.payload,
      };
    case 'SET_PACKAGE_PRICING':
      return {
        ...state,
        selectPackageAndPricing: action.payload,
      };
    case 'HANDLE_LOCK_SCREEN':
      return {
        ...state,
        visibleModalLock: action.payload,
      };
    case 'GET_QUESTION_SUCCESS':
      return {
        ...state,
        question: action.payload,
      };
    case 'GET_QUESTION_FAIL':
      return {
        ...state,
        question: [],
      };
    case 'NET_WORK_REQUEST_FAIL':
      return {
        ...state,
        loading: false,
      };
    case 'TIME_OUT':
      return {
        ...state,
        loading: false,
      };

    case 'RESET_IS_FLASH_SCREEN':
      return {
        ...state,
        isFlashScreen: action.payload,
      };
    case 'CHANGE_FLAG_VISIBLE_ENTER_PIN_CODE':
      return {
        ...state,
        visibleEnterPin: action.payload,
      };
    case 'CHANGE_FLAG_SUBMIT_TAX':
      return {
        ...state,
        isSubmitTax: action.payload,
      };
    case 'LOGIN_STAFF_SUCCESS':
      return {
        ...state,
        visibleEnterPinInvoice: action.isPincodeInvoice
          ? false
          : state.visibleEnterPinInvoice,
      };
    case 'SET_VISIBLE_ENTER_CODE_INVOICE':
      return {
        ...state,
        visibleEnterPinInvoice: action.payload,
      };

    case 'CLOSE_POPUP_ENTER_PIN':
      return {
        ...state,
        visibleEnterPin: false,
      };
    case 'SHOW_POP_UP_DISCONNECTED':
      return {
        ...state,
        visibleDisconnect: action.payload,
      };
    case 'SHOW_POP_UP_CONNECTED':
      return {
        ...state,
        visibleConnected: action.payload,
        isReloadWebview: !action.payload ? true : state.isReloadWebview,
      };
    case 'RESET_STATE_RELOAD_WEBVIEW':
      return {
        ...state,
        isReloadWebview: false,
      };
    case 'SUBMIT_APPOINTMENT_OFFLINE_SUCCESS':
      return {
        ...state,
        isReloadWebview: true,
      };
    case 'TURN_ON_OFFLINE_MODE':
      return {
        ...state,
        visibleDisconnect: false,
      };
    case 'GET_PACKAGE_AND_PRICING_SUCCESS':
      return {
        ...state,
        packageAndPricingData: action.payload ? action.payload : [],
      };
    case 'GET_MERCHANT_BY_ID':
      return {
        ...state,
        refreshingGeneral: action.isRefresh,
      };
    case 'GET_MERCHANT_BY_ID_SUCCESS':
      return {
        ...state,
        refreshingGeneral: false,
      };
    case 'GET_MERCHANT_BY_ID_FAIL':
      return {
        ...state,
        refreshingGeneral: false,
      };
    case 'CONNECT_PAX_MACHINE_ERROR':
      return {
        ...state,
        connectPAXStatus: {
          status: action.payload === 'NOT FOUND' ? true : false,
          message: getErrorMessagePaxMachine(action.payload),
        },
      };
    case 'CONNECT_PAX_MACHINE_SUCCESS':
      return {
        ...state,
        connectPAXStatus: {
          status: true,
          message: '( Pax terminal successfully connected! )',
        },
      };
    case 'TOGGLE_SETTING_TAB_PERMISSION':
      return {
        ...state,
        settingTabPermission: action.payload,
      };
    case 'CLOSE_ALL_POPUP_PIN_CODE':
      return {
        ...state,
        settingTabPermission: false,
        visibleEnterPin: false,
      };
    case 'OPEN_POPUP_CODE_PUSH':
      return {
        ...state,
        visiblePopupCodePush: action.payload,
        descriptionCodePush: action.description ? action.description : '',
      };
    case 'HANDLE_NOTIFICATION_WHEN_HAVE_A_APPOINTMENT':
      return {
        ...state,
        isHandleNotiWhenHaveAAppointment: true,
      };
    case 'RESET_STATE_HANDLE_NOTIFICATION_WHEN_HAVE_A_APPOINTMENT':
      return {
        ...state,
        isHandleNotiWhenHaveAAppointment: false,
      };
    case 'HANDLE_NOTIFI_INTERVAL_ID':
      return {
        ...state,
        notiIntervalId: action.payload,
      };
    case 'RESET_NOTIFI_INTERVAL_ID':
      return {
        ...state,
        notiIntervalId: false,
      };
    case 'GET_NOTIFICATION_LIST_SUCCESS':
      return {
        ...state,
        notificationList:
          action.currentPage === 1
            ? action.payload
            : state.notificationList.concat(action.payload),
        notiTotalPages: action.totalPages,
        notiCurrentPage: action.currentPage,
      };
    case 'GET_COUNT_UNREAD_OF_NOTIFICATION_SUCCESS':
      return {
        ...state,
        notificationContUnread: action.payload,
      };
    case 'RESET_IS_INIT_APP':
      return {
        ...initialState,
        isInitialApp: false,
      };
    case 'UPDATE_PAX_TERMINAL_ID':
      return {
        ...initialState,
        terminalID: action.payload,
      };
    case 'LOGOUT_APP':
      return {
        ...initialState,
        isInitialApp: false,
      };

    default:
      return state;
  }
}

function getErrorMessagePaxMachine(error) {
  switch (error) {
    case "You're running your Pax on DEMO MODE!":
      return "( You're running your Pax on DEMO MODE! )";
    case 'NOT FOUND':
      return '( Pax terminal successfully connected!: Not found any transactions )';
    default:
      return `(Error From Your Pax : "${error}" )`;
  }
}

// module.exports = persistReducer(
//   {
//     key: "app",
//     storage: AsyncStorage,
//     whitelist: ["isInitialApp"],
//   },
//   appReducer
// );

export default appReducer;
