import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

/**
|--------------------------------------------------
| APP SLICES
|--------------------------------------------------
*/
const log = (obj, message = '') => {
  Logger.log(`[AppMerchant  Slice] ${message}`, obj);
};
const reducerName = 'merchant.app';
const initialState = {
  appLoading: false,
  deviceId: null,
  deviceName: null,
  isPlash: true,
  merchantID: null,
  rememberMID: false,
  exportLoading: false,
  exportType: '',
};
let appSlice = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    showLoading: {
      reducer: (state, action) => {
        state.appLoading = true;
      },
    },
    hideLoading: {
      reducer: (state, action) => {
        state.appLoading = false;
      },
    },
    setDeviceInfo: {
      reducer: (state, action) => {
        return Object.assign({}, state, action.payload);
      },
    },
    startApp: {
      reducer: (state, action) => {
        state.isPlash = false;
      },
    },
    saveMerchantID: {
      reducer: (state, action) => {
        state.merchantID = action.payload;
      },
    },
    rememberMID: {
      reducer: (state, action) => {
        state.rememberMID = action.payload;
      },
    },
    showExportLoading: {
      reducer: (state, action) => {
        state.exportLoading = true;
      },
    },
    hideExportLoading: {
      reducer: (state, action) => {
        state.exportLoading = false;
      },
    },
    saveExportType: {
      reducer: (state, action) => {
        state.exportType = action.payload;
      },
    },
  },
});

let { actions, reducer } = appSlice;

let appMerchantReducer = persistReducer(
  {
    key: 'appMerchant',
    storage: AsyncStorage,
    whitelist: ['merchantID', 'rememberMID'],
  },
  reducer
);

module.exports = {
  reducer: appMerchantReducer,
  actions: { ...actions },
};
