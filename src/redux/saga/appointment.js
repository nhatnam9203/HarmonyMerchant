import { put, takeLatest, all, select } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import { requestAPI, uploadFromData } from '../../utils';
import apiConfigs from '../../configs/api';

function* getAppointmentById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('getAppointmentById : ', JSON.stringify(responses));
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_APPOINTMENT_BY_ID_SUCCESS',
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

function* getGroupAppointmentById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('getGroupAppointmentById : ', JSON.stringify(responses));
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID_SUCCESS',
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


function* addItemIntoAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('addItemIntoAppointment : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            action.isGroup ? yield put({

                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId}`,
                token: true
            }) :
                yield put({
                    type: 'GET_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action.appointmentId}`,
                    token: true
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

function* removeItemIntoAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('responses : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (action.isGroup) {
                yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId}`,
                    token: true
                })
            } else {
                yield put({
                    type: 'GET_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action.appointmentId}`,
                    token: true
                })
            }

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

function* checkoutAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('checkoutAppointment : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId}`,
                token: true
            })
            if (action.isPayment) {
                yield put({
                    type: 'PAY_APPOINTMENT',
                    body: {
                        method: action.paymentMethod
                    },
                    method: 'PUT',
                    token: true,
                    api: `${apiConfigs.BASE_API}appointment/pay/${action.appointmentId}`,
                })
            }

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

function* paymentAppointment(action) {
    try {
        action.isLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        console.log('paymentAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'CHECKOUT_SUBMIT',
                body: {},
                method: 'PUT',
                token: true,
                api: `${apiConfigs.BASE_API}checkout/submit/${responses.data}`,
                paymentMethod: action.paymentMethod,
                amount: action.amount
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({ type: 'STOP_LOADING_ROOT' });
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({ type: 'STOP_LOADING_ROOT' });
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

function* createAnymousAppointment(action) {
    try {
        action.isLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        console.log('createAnymousAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            // ------- Call checkout -----
            const appointmentId = responses.data;
            yield put({
                type: 'CHECK_OUT_APPOINTMENT_OFFLINE_SUCCESS',
                payload: appointmentId
            });
            yield put({
                type: 'CHECK_OUT_APPOINTMENT',
                body: {},
                method: 'PUT',
                token: true,
                api: `${apiConfigs.BASE_API}appointment/checkout/${appointmentId}`,
                isPayment: true,
                appointmentId,
                paymentMethod: action.paymentMethod
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

function* checkoutSubmit(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('checkoutSubmit : ', responses);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "CHECKOUT_SUBMIT_SUCCESS",
                payload: responses.data && responses.data.checkoutPaymentResponse ? {
                    ...responses.data.checkoutPaymentResponse,
                    paymentMethod: action.paymentMethod,
                    amount: action.amount
                } : {}
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* submitPaymentWithCreditCard(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('submitPaymentWithCreditCard : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

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

function* cancelHarmonyPayment(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('cancelHarmonyPayment : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

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

function* submitAppointmentOffline(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('submitAppointmentOffline : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "SUBMIT_APPOINTMENT_OFFLINE_SUCCESS"
            });

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

function* cancleAppointment(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('responses : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

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

function* removeAppointmentInGroup(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('removeAppointmentInGroup : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            // ------- Get Group Appointment --------
            const state = yield select();
            const appointment = state.appointment.groupAppointment.appointments.find((appointment) => appointment.isMain === 1);
            if (appointment) {
                yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/getGroupById/${appointment.appointmentId}`,
                    token: true
                })
            }


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

export default function* saga() {
    yield all([
        takeLatest('GET_APPOINTMENT_BY_ID', getAppointmentById),
        takeLatest('ADD_ITEM_INTO_APPOINTMENT', addItemIntoAppointment),
        takeLatest('REMOVE_ITEM_INTO_APPOINTMENT', removeItemIntoAppointment),
        takeLatest('CHECK_OUT_APPOINTMENT', checkoutAppointment),
        takeLatest('PAY_APPOINTMENT', paymentAppointment),
        takeLatest('CREATE_ANYMOUS_APPOINTMENT', createAnymousAppointment),
        takeLatest('CHECKOUT_SUBMIT', checkoutSubmit),
        takeLatest('SUBMIT_PAYMENT_WITH_CREDIT_CARD', submitPaymentWithCreditCard),
        takeLatest('CANCEL_HARMONY_PAYMENT', cancelHarmonyPayment),
        takeLatest('SUBMIT_APPOINTMENT_OFFLINE', submitAppointmentOffline),
        takeLatest('CANCEL_APPOINTMENT', cancleAppointment),
        takeLatest('GET_GROUP_APPOINTMENT_BY_ID', getGroupAppointmentById),
        takeLatest('REMOVE_APPOINTMENT_IN_GROUP', removeAppointmentInGroup),

    ])
}