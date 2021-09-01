import { persistReducer } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

const initialState = {
  paxMachineInfo: {
    commType: '',
    name: '',
    ip: '',
    port: '',
    timeout: 90000,
    bluetoothAddr: '',
    isSetup: false,
    terminalName: 'Pax',
  },
  visiblePopupPairingCode: false,
  pairingCode: '',
};

function hardwareReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBLE_POPUP_PAIRING_CODE':
      return {
        ...state,
        visiblePopupPairingCode: action.isVisible,
      };
    case 'SET_PAIRING_CODE':
      return {
        ...state,
        pairingCode: action.pairingCode,
      };

    case 'SETUP_PAX_MACHINE':
      return {
        ...state,
        paxMachineInfo: action.payload,
      };

    case 'DELETE_HARDWARE':
      return {
        ...state,
        paxMachineInfo: {
          commType: '',
          name: '',
          ip: '',
          port: '',
          timeout: 90000,
          bluetoothAddr: '',
          isSetup: false,
          terminalName: 'Pax',
        },
      };
    default:
      return state;
  }
}

const sensitiveStorage = createSensitiveStorage({
  keychainService: 'myKeychain',
  sharedPreferencesName: 'mySharedPrefs',
});

const dataLocalPersistConfig = {
  key: 'hardware',
  storage: sensitiveStorage,
};

module.exports = persistReducer(dataLocalPersistConfig, hardwareReducer);

// export default hardwareReducer;
