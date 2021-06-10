import { put, takeLatest, all } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";
import { Alert } from 'react-native';

import { requestAPI } from '../../utils';
import actions from "../actions";

function* getOrdersFromStore(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log("------- getOrdersFromStore: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_ORDERS_FROM_STORE_SUCCESS",
                payload: responses?.data || [],
                totalPages: responses?.pages || 0,
                currentPage: action?.currentPage || 0
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getOrderRetailDetail(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log("------- getOrderRetailDetail: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_ORDER_RETAIL_DETAIL_SUCCESS",
                payload: responses?.data || {},
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createTempAppointmentRetail(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log("------- createTempAppointmentRetail: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(actions.orderRetail.getTempAppointmentDetailOfRetail(responses?.data))
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getTempAppointmentDetailOfRetail(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log("------- getTempAppointmentDetailOfRetail: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_TEMP_APPOINTMENT_DETAIL_OF_RETAIL_SUCCESS",
                payload: responses?.data || {},
            });
            yield put(actions.orderRetail.switchProductDetailPopupRetail(false));
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* addItemIntoTempAppointmentRetail(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        console.log("------- addItemIntoTempAppointmentRetail: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(actions.orderRetail.getTempAppointmentDetailOfRetail(action?.tempAppointmentId))
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

export default function* saga() {
    yield all([
        takeLatest('GET_ORDERS_FROM_STORE', getOrdersFromStore),
        takeLatest('GET_ORDER_RETAIL_DETAIL', getOrderRetailDetail),
        takeLatest('CREATE_RETAIL_APPOINTMENT_TEMP', createTempAppointmentRetail),
        takeLatest('GET_TEMP_APPOINTMENT_DETAIL_OF_RETAIL', getTempAppointmentDetailOfRetail),
        takeLatest('ADD_ITEM_INTO_RETAIL_APPOINTMENT_TEMP', addItemIntoTempAppointmentRetail),

    ])
}