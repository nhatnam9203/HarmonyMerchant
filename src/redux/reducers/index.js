import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

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
import network from './network';


const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['app', 'auth', 'upload', 'network','appointment'],
    // stateReconciler: autoMergeLevel2,
};


const rootReducer = combineReducers({
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
    marketing,
    network
});

export default persistReducer(rootPersistConfig, rootReducer);