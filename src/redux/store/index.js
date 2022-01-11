import Configs from "@configs";
import AsyncStorage from "@react-native-community/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { isDevelopmentMode } from "@shared/utils/app";
import { combineReducers } from "redux";
import { createLogger } from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import Reactotron from "../../../ReactotronConfig";
import { authMiddleware } from "../middlewares";
import rootReducers from "../reducers";
import sagaRoot from "../saga";
import { rootReducers as toolKitReducers } from "../slices";

const middleware = [];

let sagaMiddleware = createSagaMiddleware();
if (isDevelopmentMode) {
  const sagaMonitor = Reactotron.createSagaMonitor();
  sagaMiddleware = createSagaMiddleware({ sagaMonitor });
}

middleware.push(authMiddleware);
middleware.push(sagaMiddleware);
if (Configs.CHROME_DEBUG_LOGGER && isDevelopmentMode) {
  middleware.push(createLogger());
}

let enhancers;
if (__DEV__) {
  enhancers = [Reactotron.createEnhancer()];
}

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: [
    "appMerchant",
    "staff",
    "app",
    "appointment",
    "auth",
    "category",
    "customer",
    "dataLocal",
    "extrasByMerchant",
    "invoice",
    "marketing",
    "network",
    "product",
    "service",
    "basketRetailer",
  ],
  debug: isDevelopmentMode, //to get useful logging
};

const reducers = combineReducers(
  Object.assign({}, rootReducers, toolKitReducers)
);
const persistedReducer = persistReducer(persistConfig, reducers);

// const enhancers = [applyMiddleware(...middleware)];
// const persistConfig: any = { enhancers };
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const composeEnhancers = composeWithDevTools({
//   // Specify name here, actionsBlacklist, actionsCreators and other options if needed
// });

const initialState = {};

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middleware),
  preloadedState: initialState,
  devTools: isDevelopmentMode,
  enhancers: enhancers,
});

const persistor = persistStore(store);

const reduxStore = () => {
  return { persistor, store };
};

sagaMiddleware.run(sagaRoot);

module.exports = reduxStore;
