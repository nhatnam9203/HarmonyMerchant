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
  },
  cloverMachineInfo: {
    name: 'Clover',
    ip: '',
    port: '',
    isSetup: false,
    token: null,
    serialNumber: '',
  },
  dejavooMachineInfo: {
    name: '',
    ip: '',
    port: '',
    isSetup: false,
  },
  paymentMachineType: 'Pax',

};

function hardwareReducer(state = initialState, action) {
  switch (action.type) {
    case 'SETUP_PAX_MACHINE':
      return {
        ...state,
        paxMachineInfo: action.payload.paymentMachineInfo,
        paymentMachineType: action.payload.paymentMachineType,
      };
    case 'SETUP_CLOVER_MACHINE':
      return {
        ...state,
        cloverMachineInfo: {...state.cloverMachineInfo, 
          ip: action.payload.paymentMachineInfo.ip,
          port: action.payload.paymentMachineInfo.port,
          isSetup: action.payload.paymentMachineInfo.isSetup,
          serialNumber: action.payload.paymentMachineInfo.serialNumber,
        },
        paymentMachineType: action.payload.paymentMachineType,
      };
    case 'SET_CLOVER_TOKEN':
      return {
        ...state,
        cloverMachineInfo: {
          ...state.cloverMachineInfo,
          token: action.payload,
        }
      }
    case 'SETUP_DEJAVOO_MACHINE':
      return {
        ...state,
        dejavooMachineInfo: {...state.dejavooMachineInfo, 
          ip: action.payload.paymentMachineInfo.ip,
          port: action.payload.paymentMachineInfo.port,
          isSetup: action.payload.paymentMachineInfo.isSetup,
          name: action.payload.paymentMachineInfo.name,
        },
        paymentMachineType: action.payload.paymentMachineType,
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
        cloverMachineInfo: {
          name: 'Clover',
          ip: '',
          port: '',
          isSetup: false,
          token: null,
        }
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
