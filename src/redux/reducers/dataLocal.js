import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import { getModalNameOfPrinter } from '@utils';

const initialState = {
  profile: {},
  token: false,
  stateCity: [],
  language: 'en',
  autoCloseAt: '',
  autoLockScreenAfter: 'Never',
  profileStaffLogin: {},
  isLoginStaff: false,
  listAppointmentsOfflineMode: [],
  deviceId: '',
  versionApp: '',
  checkEmailToResetPax: '',
  MIDStorage: '',
  isRememberMID: false,
  printerPortType: 'Bluetooth',
  printerList: [],
  printerSelect: '',
  profileLoginInvoice: {},
  isTipOnPaxMachine: true,
  isTurnOnAutoClose: false,
  bluetoothPaxInfo: {
    id: '',
    name: '',
  },

  deviceName: '',
  isTurnOnAutoClose: false,
  profileStaffLoginReportServer: {},
  profileLoginReport: {},
  tokenReportServer: false,
  isLoginStaffReportServer: false,
};

function dataLocalReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_APP_SUCCESS':
      return {
        ...state,
        checkEmailToResetPax: action.payload,
        MIDStorage: action.isRememberMID ? action.payload : '',
      };
    case 'TOGGLE_SAVE_MID':
      return {
        ...state,
        isRememberMID: action.payload,
      };
    case 'UPDATE_AUTO_LOCK_TIME':
      return {
        ...state,
        autoLockScreenAfter: action.payload,
      };
    case 'SAVE_PROFILE_LOCAL':
      return {
        ...state,
        profile: action.payload.profile,
        token: action?.payload?.token || state.token,
      };
    case 'SAVE_PROFILE_REPORT_SERVER':
      return {
        ...state,
        profileLoginReport: action.payload.profile,
        tokenReportServer: action?.payload?.token || state.tokenReportServer,
      };
    case 'GET_MERCHANT_BY_ID_SUCCESS':
      return {
        ...state,
        profile: action.payload,
      };
    case 'CHANGE_SETTING_LOCAL_APP':
      return {
        ...state,
        language: action.payload.language,
        autoCloseAt: action.payload.autoCloseAt,
      };
    case 'GET_STATE_CITY_SUCCESS':
      return {
        ...state,
        stateCity: action.payload,
      };
    case 'UPDATE_MERCHANT_PROFILE':
      return {
        ...state,
        profile: action.payload,
      };
    case 'UPDATE_PROFILE_STAFF_SUCCESS':
      return {
        ...state,
        profileStaffLogin: action.payload,
      };
    case 'UPDATE_PROFILE_STAFF_REPORT_SERVER_SUCCESS':
      return {
        ...state,
        profileStaffLoginReportServer: action.payload,
      };
    case 'RESET_NEED_SETTING_STORE':
      return {
        ...state,
        profile: { ...state.profile, needSetting: false },
      };
    case 'RESET_STATE_LOGIN_STAFF':
      return {
        ...state,
        isLoginStaff: action.payload,
      };
    case 'LOGIN_STAFF':
      return {
        ...state,
        isLoginStaff: false,
      };
    case 'LOGIN_STAFF_REPORT_SERVER':
      return {
        ...state,
        isLoginStaffReportServer: false,
      };
    case 'RESET_STATE_LOGIN_STAFF_REPORT_SERVER':
      return {
        ...state,
        isLoginStaffReportServer: action.payload,
      };
    case 'ADD_APPOINTMENT_OFFLINE_MODE':
      return {
        ...state,
        listAppointmentsOfflineMode: [
          ...state.listAppointmentsOfflineMode,
          action.payload,
        ],
      };
    case 'SUBMIT_APPOINTMENT_OFFLINE_SUCCESS': {
      return {
        ...state,
        listAppointmentsOfflineMode: [],
      };
    }
    case 'UPDATE_BUSSINES_HOUR': {
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    }
    case 'UPDATE_DEVICE_ID':
      return {
        ...state,
        deviceId: action.payload,
      };
    case 'UPDATE_DEVICE_NAME':
      return {
        ...state,
        deviceName: action.payload,
      };
    case 'UPDATE_VERSION_APP':
      return {
        ...state,
        versionApp: action.payload,
      };

    case 'UPDATE_PRINTER_LIST':
      return {
        ...state,
        printerList: action.payload,
        printerSelect: getModalNameOfPrinter(
          action.payload,
          state.printerSelect,
        ),
      };
    case 'UPDATE_PRINTER_PORT_TYPE':
      return {
        ...state,
        printerPortType: action.payload,
      };
    case 'SELECT_PRINTER':
      return {
        ...state,
        printerSelect: action.payload,
      };
    case 'UPDATE_PROFILE_LOGIN_INVOICE':
      return {
        ...state,
        profileLoginInvoice: action.payload,
      };
    case 'SWITCH_TIP_ON_PAX_MACHINE':
      return {
        ...state,
        isTipOnPaxMachine: action.payload,
      };
    case 'SWITCH_AUTO_CLOSE':
      return {
        ...state,
        isTurnOnAutoClose: action.payload,
      };
    case 'SAVE_BLUETOOTH_PAX_INFO':
      return {
        ...state,
        bluetoothPaxInfo: action.payload,
      };
    case 'CHANGE_IS_GIFT_FOR_NEW_SUCCESS':
      return {
        ...state,
        profile: {
          ...state.profile,
          giftForNewEnabled: action.payload,
        },
      };
    case 'CHANGE_IS_GIFT_FOR_NEW_FAIL':
      return {
        ...state,
        profile: {
          ...state.profile,
          giftForNewEnabled: action.payload,
        },
      };
    case 'RESET_PROFILE_INVOICE_LOGIN':
      return {
        ...state,
        profileLoginInvoice: {},
      };
    case 'LOGOUT_APP':
      return {
        ...initialState,
        stateCity: state.stateCity,
        language: state.language,
        autoCloseAt: state.autoCloseAt,
        autoLockScreenAfter: state.autoLockScreenAfter,
        paxMachineInfo: state.paxMachineInfo,
        printerSelect: state.printerSelect,
        MIDStorage: state.MIDStorage,
        versionApp: state.versionApp,
        isRememberMID: state.isRememberMID,
        deviceName: state.deviceName,
        deviceId: state.deviceId,
      };
    default:
      return state;
  }
}

module.exports = persistReducer(
  {
    key: 'dataLocal',
    storage: AsyncStorage,
    // blacklist: []
  },
  dataLocalReducer,
);
// export default dataLocalReducer;
