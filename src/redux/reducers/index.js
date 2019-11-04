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
    blacklist: ['app', 'auth', 'upload']
};

const authPersistConfig = {
    key: 'dataLocal',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    dataLocal,
    app,
    auth,
    category: persistReducer({
        key: 'category',
        storage: AsyncStorage,
        whitelist: ['categoriesByMerchant']
    }, category),
    product: persistReducer({
        key: 'product',
        storage: AsyncStorage,
        whitelist: ['productsByMerchantId']
    }, product),
    staff: persistReducer({
        key: 'staff',
        storage: AsyncStorage,
        whitelist: ['listStaffByMerchant']
    }, staff),
    service: persistReducer({
        key: 'service',
        storage: AsyncStorage,
        whitelist: ['servicesByMerchant']
    }, service),
    extra: persistReducer({
        key: 'extra',
        storage: AsyncStorage,
        whitelist: ['extrasByMerchant']
    }, extra),
    upload,
    appointment: persistReducer({
        key: 'appointment',
        storage: AsyncStorage,
        whitelist: ['listAppointmentsOfflineMode']
    }, appointment),
    customer: persistReducer({
        key: 'customer',
        storage: AsyncStorage,
        whitelist: ['listCustomersByMerchant']
    }, customer),
    invoice: persistReducer({
        key: 'invoice',
        storage: AsyncStorage,
        whitelist: ['listInvoicesByMerchant']
    }, invoice),
    marketing: persistReducer({
        key: 'marketing',
        storage: AsyncStorage,
        whitelist: ['listBanners', 'promotions']
    }, marketing),
});

export default persistReducer(rootPersistConfig, rootReducer);