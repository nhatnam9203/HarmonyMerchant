import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI } from '../../utils';

function* getMerchantByID(action) {
    try {
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
    } catch (error) {
    }
}

function* registerUser(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            NavigationServices.navigate('SignIn');
        } else {
            yield put({ type: 'STOP_LOADING_ROOT' });
            setTimeout(() => {
                alert(`Error: ${responses.message}`);
            }, 200)
            NavigationServices.navigate('GeneralInfo');
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


export default function* saga() {
    yield all([
        takeLatest('GET_MERCHANT_BY_ID', getMerchantByID),
        takeLatest('REGISTER_USER', registerUser),

    ])
}