import { put, takeLatest, all, select } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import { requestAPI, uploadFromData } from '../../utils';
import apiConfigs from '../../configs/api';

function* getAppointmentById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('getAppointmentById : ', JSON.stringify(responses));
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-getAppointmentById: ${error}`)
        // },2000);

        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getGroupAppointmentById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('getGroupAppointmentById : ', JSON.stringify(responses));

        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const data = responses.data ? responses.data : false;
            if (data) {
                yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID_SUCCESS',
                    payload: responses.data,
                    paymentDetailInfo: {
                        checkoutGropId: data && data.checkoutGroupId ? data.checkoutGroupId : 0,
                        customerName: "",
                        phone: "",
                        status: data && data.status ? data.status : "Pending",
                        grandTotal: data && data.total ? data.total : 0,
                        paidAmounts: data && data.checkoutPayments ? data.checkoutPayments : [],
                        dueAmount: data && data.dueAmount ? data.dueAmount : 0
                    }
                });
                if (action.isPayment) {
                    yield put({
                        type: 'PAY_APPOINTMENT',
                        body: {
                            method: action.paymentMethod,
                            amount: action.paidAmount
                        },
                        method: 'PUT',
                        token: true,
                        api: `${apiConfigs.BASE_API}appointment/selectpaymentmethod/${responses.data.checkoutGroupId}`,
                        paymentMethod: action.paymentMethod,
                        amount: action.paidAmount,
                        creditCardInfo: action.creditCardInfo,
                        merchantId: action.merchantId
                    })
                }
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-getGroupAppointmentById: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* addItemIntoAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('addItemIntoAppointment : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (!action.isBlock) {
                action.isGroup ? yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId ? action.appointmentId : "addItemIntoAppointment"}`,
                    token: true
                }) :
                    yield put({
                        type: 'GET_APPOINTMENT_BY_ID',
                        method: 'GET',
                        api: `${apiConfigs.BASE_API}appointment/${action.appointmentId}`,
                        token: true
                    })
            } else {
                yield put({
                    type: 'GET_BLOCK_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action.appointmentId}`,
                    token: true,
                    appointmentId: action.appointmentId
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* removeItemIntoAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('removeItemIntoAppointment : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (!action.isBlock) {
                if (action.isGroup) {
                    yield put({
                        type: 'GET_GROUP_APPOINTMENT_BY_ID',
                        method: 'GET',
                        api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId ? action.appointmentId : "removeItemIntoAppointment"}`,
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
            } else {
                yield put({
                    type: 'GET_BLOCK_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action.appointmentId}`,
                    token: true,
                    appointmentId: action.appointmentId
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-removeItemIntoAppointment: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkoutAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('checkoutAppointment : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId ? action.appointmentId : "checkoutAppointment"}`,
                token: true,
                appointmentId: action.appointmentId,
                paidAmount: action.paidAmount,
                isPayment: action.isPayment,
                paymentMethod: action.paymentMethod,
                creditCardInfo: action.creditCardInfo,
                merchantId: action.merchantId
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
        // setTimeout(() =>{
        //     alert(`error-checkoutAppointment: ${error}`)
        // },2000);
        yield put({ type: error });

    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* paymentAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' })
        const responses = yield requestAPI(action);
        // console.log('paymentAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "PAY_APPOINTMENT_ID",
                payload: responses.data
            });
            if (action.paymentMethod !== 'harmony' && action.paymentMethod !== 'credit_card') {
                yield put({
                    type: 'CHECKOUT_SUBMIT',
                    body: {},
                    method: 'PUT',
                    token: true,
                    api: `${apiConfigs.BASE_API}checkout/submit/${responses.data}`,
                    paymentMethod: action.paymentMethod,
                    amount: action.amount,
                });
            };
            if (action.paymentMethod == 'credit_card' && action.creditCardInfo) {
                yield put({
                    type: 'SUBMIT_PAYMENT_WITH_CREDIT_CARD',
                    body: {
                        merchantId: action.merchantId,
                        userId: 0,
                        title: 'pax',
                        responseData: action.creditCardInfo,
                        checkoutPaymentId: responses.data
                    },
                    method: 'POST',
                    token: true,
                    api: `${apiConfigs.BASE_API}paymentTransaction`,
                    paymentMethod: action.paymentMethod,
                    amount: action.amount,
                    checkoutPaymentId: responses.data
                })
            };
        } else if (parseInt(codeNumber) === 401) {
            yield put({ type: 'STOP_LOADING_ROOT' });
            yield put({
                type: 'UNAUTHORIZED'
            });
        } else {
            yield put({ type: 'STOP_LOADING_ROOT' });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            });
        }
    } catch (error) {

        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-paymentAppointment: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createAnymousAppointment(action) {
    try {
        action.isLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        //console.log('createAnymousAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            // ------- Call checkout -----
            const appointmentId = responses.data;
            if (!action.isPayment) {
                yield put({
                    type: "SET_CANCEL_APPOINTMENT"
                })
            }
            if (action.paymentMethod !== 'credit_card') {
                yield put({
                    type: 'CHECK_OUT_APPOINTMENT',
                    body: {
                        checkoutGroupId: 0,
                    },
                    method: 'PUT',
                    token: true,
                    api: `${apiConfigs.BASE_API}appointment/checkout/${appointmentId}`,
                    checkoutGroupId: 0,
                    appointmentId,
                    paidAmount: action.paidAmount,
                    isPayment: action.isPayment,
                    paymentMethod: action.paymentMethod,
                })
            } else {
                yield put({
                    type: 'CHECK_OUT_APPOINTMENT',
                    body: {
                        checkoutGroupId: 0,
                    },
                    method: 'PUT',
                    token: true,
                    api: `${apiConfigs.BASE_API}appointment/checkout/${appointmentId}`,
                    checkoutGroupId: 0,
                    appointmentId,
                    paidAmount: action.paidAmount,
                    isPayment: true,
                    paymentMethod: action.paymentMethod,
                    creditCardInfo: action.creditCardInfo,
                    merchantId: action.merchantId

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
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-createAnymousAppointment: ${error}`)
        // },2000);

        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkoutSubmit(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('checkoutSubmit : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            const dueAmount = responses.data && responses.data.checkoutPaymentResponse && responses.data.checkoutPaymentResponse.dueAmount ? parseFloat(responses.data.checkoutPaymentResponse.dueAmount) : 0;
            if (dueAmount === 0) {
                yield put({
                    type: "TRACSACTION_COMPLETED"
                });
            } else if (dueAmount < 0) {
                yield put({
                    type: "SHOW_POPUP_CHANGED_MONEY",
                    payload: Math.abs(dueAmount)
                });
            }
            yield put({
                type: "CHECKOUT_SUBMIT_SUCCESS",
                payload: responses.data && responses.data.checkoutPaymentResponse ? {
                    ...responses.data.checkoutPaymentResponse,
                    paymentMethod: action.paymentMethod,
                    amount: action.amount
                } : {},
                visiblePopupPaymentDetails: dueAmount > 0 ? true : false
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
        //console.log('submitPaymentWithCreditCard : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'CHECKOUT_SUBMIT',
                body: {},
                method: 'PUT',
                token: true,
                api: `${apiConfigs.BASE_API}checkout/submit/${action.checkoutPaymentId}`,
                paymentMethod: action.paymentMethod,
                amount: action.amount
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

        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-submitPaymentWithCreditCard: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* cancelHarmonyPayment(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('cancelHarmonyPayment : ', responses);
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

        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-cancelHarmonyPayment: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* submitAppointmentOffline(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('submitAppointmentOffline : ' + JSON.stringify(responses));
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

        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-submitAppointmentOffline: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* cancleAppointment(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('cancleAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (action.isBlock) {
                yield put({
                    type: "REMOVE_BLOCK_APPOINTMENT_IN_REDUX",
                    payload: action.appointmentId
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

        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-cancleAppointment: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* removeAppointmentInGroup(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('removeAppointmentInGroup : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            // ------- Get Group Appointment --------
            const state = yield select();
            const { groupAppointment } = state.appointment;
            const mainAppointmentId = groupAppointment.mainAppointmentId ? groupAppointment.mainAppointmentId : 0;
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${mainAppointmentId ? mainAppointmentId : removeAppointmentInGroup}`,
                token: true
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
        //console.log('---- error : ', error);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-removeAppointmentInGroup: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkSerialNumber(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('checkSerialNumber : ' + JSON.stringify(responses));
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (!action.bodyAction) {
                const state = yield select();
                const { groupAppointment } = state.appointment;
                const mainAppointmentId = groupAppointment.mainAppointmentId ? groupAppointment.mainAppointmentId : 0;
                yield put({
                    type: 'ADD_ITEM_INTO_APPOINTMENT',
                    body: {
                        giftCards: [{
                            bookingGiftCardId: 0,
                            giftCardId: responses.data && responses.data.giftCardId ? responses.data.giftCardId : 0
                        }],
                        services: [],
                        extras: [],
                        products: [],
                    },
                    method: 'PUT',
                    token: true,
                    api: `${apiConfigs.BASE_API}appointment/additem/${mainAppointmentId}`,
                    appointmentId: mainAppointmentId,
                    isGroup: true
                })
            } else {
                //console.log('ddddddd');
                yield put({
                    type: 'CREATE_ANYMOUS_APPOINTMENT',
                    body: { ...action.bodyAction, giftCards: [{ bookingGiftCardId: 0, GiftCardId: responses.data.giftCardId ? responses.data.giftCardId : 0 }] },
                    ...action.optionAction
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
        //console.log('error-checkSerialNumber: ', error);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-checkSerialNumber: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updateCustomerInAppointment(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('updateCustomerInAppointment : ' + JSON.stringify(responses));
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
        //console.log('---- error : ', error);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-removeAppointmentInGroup: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updateProductInAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('updateProductInAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            action.isGroup ? yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId ? action.appointmentId : "updateProductInAppointment"}`,
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
        //console.log('---- error : ', error);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // setTimeout(() =>{
        //     alert(`error-removeAppointmentInGroup: ${error}`)
        // },2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createBlockAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' })
        const responses = yield requestAPI(action);
        // console.log('createBlockAppointment : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            const appointmentId = responses.data ? responses.data : 0;
            yield put({
                type: 'GET_BLOCK_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/${appointmentId}`,
                token: true,
                appointmentId
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

function* getBlockAppointmentById(action) {
    try {
        action.isLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        // console.log('getBlockAppointmentById : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            // const appointmentId = responses.data ? responses.data : 0 ;
            yield put({
                type: "GET_BLOCK_APPOINTMENT_BY_ID_SUCCESS",
                payload: responses.data
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: "GET_BLOCK_APPOINTMENT_BY_ID_FAIL"
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({
            type: "GET_BLOCK_APPOINTMENT_BY_ID_FAIL"
        });
        yield put({ type: 'STOP_LOADING_ROOT' });
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
        takeLatest('CHECK_SERIAL_NUMBER', checkSerialNumber),
        takeLatest('UPDATE_CUSTOMER_IN_APPOINTMENT', updateCustomerInAppointment),

        takeLatest('UPDATE_PRODUCT_IN_APPOINTMENT', updateProductInAppointment),
        takeLatest('CREATE_BLOCK_APPOINTMENT', createBlockAppointment),
        takeLatest('GET_BLOCK_APPOINTMENT_BY_ID', getBlockAppointmentById),
    ])
}