import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI } from '../../utils';

function* getMerchantByID(action) {
    try {
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
    } catch (error) {
    }
}

function* registerUser(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getStateCity(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
        yield put({
            type: 'GET_STATE_CITY_SUCCESS',
            payload: responses.data

        });
    } catch (error) {
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        // yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getQuestion(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses : ', responses);
        yield put({
            type: 'GET_QUESTION_SUCCESS',
            payload: responses.data

        });
    } catch (error) {
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        // yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* requestNetworkTimeout(action) {
    setTimeout(() =>{
        alert('Please check your internet !');
    },1000)
    
}

function* timeout(action) {
    setTimeout(() =>{
        alert('Server not response');
    },1000)
    
}

export default function* saga() {
    yield all([
        takeLatest('GET_MERCHANT_BY_ID', getMerchantByID),
        takeLatest('REGISTER_USER', registerUser),
        takeLatest('GET_STATE_CITY', getStateCity),
        takeLatest('GET_QUESTION', getQuestion),
        takeLatest('NET_WORK_REQUEST_FAIL', requestNetworkTimeout),
        takeLatest('TIME_OUT', timeout)
    ])
}