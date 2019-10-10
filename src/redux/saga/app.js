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
        // console.log('--- registerUser : ', responses);
        // console.log('----- body register : ' + JSON.stringify(action.body));
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            NavigationServices.navigate('SignIn');
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
            NavigationServices.navigate('GeneralInfo');
        }
    } catch (error) {
        yield put({ type: error });
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
        yield put({ type: error });
    } finally {
        // yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getQuestion(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses 2222 : ', responses);
        yield put({
            type: 'GET_QUESTION_SUCCESS',
            payload: responses.data

        });
    } catch (error) {
        yield put({ type: error });
    } finally {
        // yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* merchantSetting(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- responses 2222 : ', responses);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'UPDATE_MERCHANT_PROFILE',
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* sendLinkInstallApp(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('--- sendLinkInstallApp : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({ type: 'STOP_LOADING_ROOT' });
            setTimeout(() => {
                alert('Sent !')
            }, 500)

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* requestNetworkTimeout(action) {
    yield put({ type: 'STOP_LOADING_ROOT' });
    // alert('Please check your internet !');
    setTimeout(() => {
        alert('Please check your internet !');
    }, 300)
}

function* timeout(action) {
    yield put({ type: 'STOP_LOADING_ROOT' });
    setTimeout(() => {
        alert('Server not response');
    }, 300)

}

function* showErrorMessage(action) {
    yield put({ ...action, type: 'STOP_LOADING_ROOT' });
    // alert(action.message);
    setTimeout(() => {
        alert(action.message);
    }, 300)

}

function* handleSomethingWentWrong(action) {
    try {
        yield put({ ...action, type: 'STOP_LOADING_ROOT' });
        alert('Something went wrong!');
    } catch (error) {
        yield put({ type: error });
    }
}



export default function* saga() {
    yield all([
        takeLatest('GET_MERCHANT_BY_ID', getMerchantByID),
        takeLatest('REGISTER_USER', registerUser),
        takeLatest('GET_STATE_CITY', getStateCity),
        takeLatest('GET_QUESTION', getQuestion),
        takeLatest('SEND_LINK_INSTALL_APP', sendLinkInstallApp),

        takeLatest('NET_WORK_REQUEST_FAIL', requestNetworkTimeout),
        takeLatest('TIME_OUT', timeout),
        takeLatest('SHOW_ERROR_MESSAGE', showErrorMessage),
        takeLatest('MERCHANT_SETTING', merchantSetting),
        takeLatest('SOMETHING_WENT_WRONG', handleSomethingWentWrong),
    ])
}