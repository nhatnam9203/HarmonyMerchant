import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI } from '../../utils';

function* getMerchantByID(action) {
    try {
        console.log('--- getMerchantByID --');
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
    } catch (error) {
    }
}


export default function* saga() {
    yield all([
        takeLatest('GET_MERCHANT_BY_ID', getMerchantByID),
    ])
}