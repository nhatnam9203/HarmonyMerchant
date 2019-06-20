import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import app from './app';
import dataLocal from './dataLocal';
import auth from './auth';
import category from './category';
import product from './product';
import staff from './staff';

const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['dataLocal']
};

const authPersistConfig = {
    key: 'dataLocal',
    storage: storage,
};

const rootReducer = combineReducers({
    dataLocal: persistReducer(authPersistConfig, dataLocal),
    app,
    auth,
    category,
    product,
    staff
});

export default persistReducer(rootPersistConfig, rootReducer);