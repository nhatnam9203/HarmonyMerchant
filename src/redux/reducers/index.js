import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import app from './app';
import dataLocal from './dataLocal';
import auth from './auth';
import category from './category';
import product from './product';
import staff from './staff';
import service from './service';
import extra from './extra';
import upload from './upload';
import appointment from './appointment';
import customer from './customer';
import invoice from './invoice';
import marketing from './marketing';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['dataLocal']
};

const authPersistConfig = {
    key: 'dataLocal',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    // dataLocal: persistReducer(authPersistConfig, dataLocal),
    dataLocal,
    app,
    auth,
    category,
    product,
    staff,
    service,
    extra,
    upload,
    appointment,
    customer,
    invoice,
    marketing
});

export default persistReducer(rootPersistConfig, rootReducer);