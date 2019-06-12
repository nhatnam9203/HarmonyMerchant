import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI } from '../../utils';

function* addCategory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else {
        }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getCategoriesByMerchantId(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log(responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type:'GET_CATEGORIES_BY_MERCHANR_ID_SUCCESS',
                payload :responses.data
            })
        } else {
        }
        // const { codeNumber } = responses;
        // if (parseInt(codeNumber) == 200) {
        //     NavigationServices.navigate('SignIn');
        // } else {
        //     yield put({ type: 'STOP_LOADING_ROOT' });
        //     setTimeout(() => {
        //         alert(`Error: ${responses.message}`);
        //     }, 200)
        //     NavigationServices.navigate('GeneralInfo');
        // }
    } catch (error) {
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


export default function* saga() {
    yield all([
        takeLatest('ADD_CATEGORY', addCategory),
        takeLatest('GET_CATEGORIES_BY_MERCHANR_ID', getCategoriesByMerchantId),

        
    ])
}