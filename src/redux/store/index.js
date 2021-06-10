import Configs from '@configs';
import AsyncStorage from '@react-native-community/async-storage';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { isDevelopmentMode } from '@shared/utils/app';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import Reactotron from '../../../ReactotronConfig';
import { authMiddleware } from '../middlewares';
import rootReducers from '../reducers';
import sagaRoot from '../saga';
import { rootReducers as toolKitReducers } from '../slices';

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

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['appMerchant'],
  debug: isDevelopmentMode, //to get useful logging
};

const reducers = combineReducers(
  Object.assign({}, rootReducers, toolKitReducers),
);
const persistedReducer = persistReducer(persistConfig, reducers);

// const enhancers = [applyMiddleware(...middleware)];
// const persistConfig: any = { enhancers };
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const composeEnhancers = composeWithDevTools({
//   // Specify name here, actionsBlacklist, actionsCreators and other options if needed
// });

const initialState = {};
let enhancers;
if (isDevelopmentMode) {
  enhancers = [Reactotron.createEnhancer()];
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    ...middleware,
  ],
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
