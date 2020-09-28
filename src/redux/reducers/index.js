import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import createSensitiveStorage from "redux-persist-sensitive-storage";

import app from "./app";
import dataLocal from "./dataLocal";
import auth from "./auth";
import category from "./category";
import product from "./product";
import staff from "./staff";
import service from "./service";
import extra from "./extra";
import upload from "./upload";
import appointment from "./appointment";
import customer from "./customer";
import invoice from "./invoice";
import marketing from "./marketing";
import network from "./network";
import report from "./report";

const sensitiveStorage = createSensitiveStorage({
  keychainService: "myKeychain",
  sharedPreferencesName: "mySharedPrefs"
});


const rootPersistConfig = (nameReducer) => {
  return {
    // key: "root",
    key:`${nameReducer}`,
    storage: AsyncStorage,
    // blacklist: ["app", "auth", "upload", "network", "appointment"],
  }
};

const dataLocalPersistConfig = {
  key: "dataLocal",
  storage: sensitiveStorage
};

const appReducer = combineReducers({
  dataLocal: persistReducer(dataLocalPersistConfig, dataLocal),
  app,
  auth: persistReducer(rootPersistConfig("auth"), auth),
  category: persistReducer(rootPersistConfig("category"), category),
  product: persistReducer(rootPersistConfig("product"), product),
  staff: persistReducer(rootPersistConfig("staff"), staff),
  service: persistReducer(rootPersistConfig("service"), service),
  extra: persistReducer(rootPersistConfig("extra"), extra),
  upload: persistReducer(rootPersistConfig("upload"), upload),
  appointment,
  customer: persistReducer(rootPersistConfig("customer"), customer),
  invoice: persistReducer(rootPersistConfig("invoice"), invoice),
  marketing: persistReducer(rootPersistConfig("marketing"), marketing),
  network: persistReducer(rootPersistConfig("network"), network),
  report: persistReducer(rootPersistConfig("report"), report),
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_APP") {
    const { dataLocal } = state;
    state = {
      dataLocal: {
        profile: {},
        token: false,
        stateCity: dataLocal.stateCity,
        language: dataLocal.language,
        autoCloseAt: dataLocal.autoCloseAt,
        autoLockScreenAfter: dataLocal.autoLockScreenAfter,
        paxMachineInfo: dataLocal.paxMachineInfo,
        MIDStorage: dataLocal.MIDStorage,
        profileStaffLogin: {},
        isLoginStaff: false,
        listAppointmentsOfflineMode: [],
        deviceId: "",
        versionApp: dataLocal.versionApp,
        isRememberMID: dataLocal.isRememberMID,
      },
    };
  }

  return appReducer(state, action);
};

// export default persistReducer(rootPersistConfig, rootReducer);
export default rootReducer;
