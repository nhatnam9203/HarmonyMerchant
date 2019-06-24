import { put, takeLatest, all, join } from "redux-saga/effects";

import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addCategory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_CATEGORIES_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}category/getbymerchant/${action.merchantId}`
            })
        } else {
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getProductsByMerchantId(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log(responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID_SUCCESS',
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`
            })
        } else {
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restoreProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`
            })
        } else {
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


export default function* saga() {
    yield all([
        // takeLatest('ADD_CATEGORY', addCategory),
        takeLatest('GET_PRODUCTS_BY_MERCHANR_ID', getProductsByMerchantId),
        takeLatest('ARCHIVE_PRODUCT', archiveProduct),
        takeLatest('RESTORE_PRODUCT', restoreProduct),
    ])
}