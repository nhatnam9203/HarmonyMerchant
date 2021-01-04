import { put, takeLatest, all, select, takeEvery, delay } from "redux-saga/effects";
import _ from "ramda";
import { Alert } from "react-native";

import { requestAPI, formatNumberFromCurrency } from '../../utils';
import apiConfigs from '../../configs/api';

function* getAppointmentById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
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
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getGroupAppointmentById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const data = responses?.data || false;
            if (data) {
                yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID_SUCCESS',
                    payload: responses?.data,
                    paymentDetailInfo: {
                        checkoutGropId: data?.checkoutGroupId || 0,
                        customerName: "",
                        phone: "",
                        status: data?.status || "Pending",
                        grandTotal: data?.total || 0,
                        paidAmounts: data?.checkoutPayments || [],
                        dueAmount: data?.dueAmount || 0
                    }
                });

                const subTotal = data.subTotal ? formatNumberFromCurrency(data.subTotal) : 0;
                const discount = data.discount ? formatNumberFromCurrency(data.discount) : 0;
                if (subTotal < discount && action.isNotShowMessage) {
                    setTimeout(() => {
                        Alert.alert(
                            `Warning`,
                            `Discount cannot be more than the subtotal.`,
                            [

                                { text: 'OK', onPress: () => { } }
                            ],
                            { cancelable: false }
                        );
                    }, 500);

                }

                // ------------ CHECKOUT_SUBMIT CREDIT CARD ---------
                if (action.isCheckoutSubmit) {
                    yield put({
                        type: 'CHECKOUT_SUBMIT',
                        body: {},
                        method: 'PUT',
                        token: true,
                        api: `${apiConfigs.BASE_API}checkout/submit/${action.checkoutPaymentId}`,
                        paymentMethod: action.paymentMethod,
                        amount: action.amount
                    });
                    return;
                }



                // ------------ Update Customer Buy Appointment ---------
                if (!action.isNotUpdateCustomerBuyInRedux) {
                    const mainAppointmentId = data?.mainAppointmentId || false;
                    if (mainAppointmentId) {
                        const appointments = data?.appointments || [];
                        if (appointments.length > 0) {
                            const mainAppointment = appointments.find(appointment => appointment.appointmentId === mainAppointmentId);
                            if (mainAppointment) {
                                yield put({
                                    type: "UPDATE_CUSTOMER_INFO_FROM_GET_APPOINTMENT",
                                    payload: {
                                        customerId: mainAppointment?.customerId || 0,
                                        userId: mainAppointment?.userId || 0,
                                        firstName: mainAppointment?.firstName || "",
                                        lastName: mainAppointment?.lastName || "",
                                        phone: mainAppointment?.phoneNumber || "",
                                    }
                                })
                            }
                        }
                    }
                }

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
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* addItemIntoAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (!action.isBlock) {
                action.isGroup ? yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/getGroupById/${action?.appointmentId || "addItemIntoAppointment"}`,
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
                message: responses?.message
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (!action.isBlock) {
                if (action.isGroup) {
                    yield put({
                        type: 'GET_GROUP_APPOINTMENT_BY_ID',
                        method: 'GET',
                        api: `${apiConfigs.BASE_API}appointment/getGroupById/${action?.appointmentId || "removeItemIntoAppointment"}`,
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
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkoutAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action?.appointmentId || "checkoutAppointment"}`,
                token: true,
                appointmentId: action.appointmentId,
                paidAmount: action.paidAmount,
                isPayment: action.isPayment,
                paymentMethod: action.paymentMethod,
                creditCardInfo: action.creditCardInfo,
                merchantId: action.merchantId,
                isNotUpdateCustomerBuyInRedux: action?.isNotUpdateCustomerBuyInRedux || false
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });

    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* paymentAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' })
        const responses = yield requestAPI(action);
        console.log("------ PAY_APPOINTMENT: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "PAY_APPOINTMENT_ID",
                payload: responses?.data || 0
            });
            if (action.paymentMethod !== 'harmony' && action.paymentMethod !== 'credit_card' && action.paymentMethod !== "debit_card") {
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
            if ((action.paymentMethod == 'credit_card' || action.paymentMethod == 'debit_card') && action.creditCardInfo) {
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
                message: responses?.message
            });
        }
    } catch (error) {

        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createAnymousAppointment(action) {
    try {
        if (action.isLoading) {
            yield put({ type: 'LOADING_ROOT' })
        }
        const responses = yield requestAPI(action);
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
            if (action.paymentMethod !== 'credit_card' && action.paymentMethod !== 'debit_card') {
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
                    isNotUpdateCustomerBuyInRedux: action?.isNotUpdateCustomerBuyInRedux || false
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
                    merchantId: action.merchantId,
                    isNotUpdateCustomerBuyInRedux: action?.isNotUpdateCustomerBuyInRedux || false
                })
            }
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkoutSubmit(action) {
    try {
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const dueAmount = parseFloat(responses?.data?.checkoutPaymentResponse?.dueAmount || 0);
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
                payload: responses?.data?.checkoutPaymentResponse ? {
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
                message: responses?.message
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
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            // ------- Get Group Appointment --------
            const state = yield select();
            const { groupAppointment } = state.appointment;
            const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${mainAppointmentId}`,
                token: true,
                isCheckoutSubmit: true,
                checkoutPaymentId: action.checkoutPaymentId,
                paymentMethod: action.paymentMethod,
                amount: action.amount
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* cancelHarmonyPayment(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* submitAppointmentOffline(action) {
    try {
        const responses = yield requestAPI(action);
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
                message: responses?.message
            })
        }
    } catch (error) {

        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* cancleAppointment(action) {
    try {
        if (action.isBlock && !action.isCancelManyAppointment) {
            yield put({ type: 'LOADING_ROOT' });
        }
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (action.isBlock && !action.isCancelManyAppointment) {
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
                type: "CANCEL_APPOINTMENT_FAIL"
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({
            type: "CANCEL_APPOINTMENT_FAIL"
        });
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* removeAppointmentInGroup(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            // ------- Get Group Appointment --------
            const state = yield select();
            const { groupAppointment } = state.appointment;
            const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
            yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${mainAppointmentId ? mainAppointmentId : "removeAppointmentInGroup"}`,
                token: true
            });

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkSerialNumber(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log("checkSerialNumber: ", JSON.stringify(responses));
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (action.isGiftCardPayment) {
                yield put({
                    type: 'VISIBLE_POPUP_ACTIVE_GIFT_CARD',
                    payload: false
                });
                yield put({
                    type: "GIFT_CARD_PAYMENT_INFO",
                    payload: responses.data ? responses.data : {}
                });
                yield put({
                    type: "TOGGLE_POPUP_GIFT_CARD_PAYMENT_DETAIL",
                    payload: true
                })

            } else {
                // --------- Close popup Active Gift Card -----------
                yield put({
                    type: 'VISIBLE_POPUP_ACTIVE_GIFT_CARD',
                    payload: false
                });
                // ---------- Save Action Information ----------
                yield put({
                    type: "SAVE_GIFT_CARD_ACTION_INFO",
                    addGiftCardInfoAction: { ...action, giftCardInfo: { ...responses?.data } || {} }
                });

                // yield delay(300);
                // yield put({
                //     type: "SWITCH_POPUP_GIFT_CARD_ENTER_AMOUNT",
                //     payload: true,
                // });
            }
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updateProductInAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            action.isGroup ? yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action?.appointmentId || "updateProductInAppointment"}`,
                token: true
            }) :
                yield put({
                    type: 'GET_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action?.appointmentId}`,
                    token: true
                })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createBlockAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' })
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            const appointmentId = responses?.data || 0;
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
                message: responses?.message
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
        if (action.isLoading) {
            yield put({ type: 'LOADING_ROOT' })
        }
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            const data = responses?.data || {};
            yield put({
                type: "GET_BLOCK_APPOINTMENT_BY_ID_SUCCESS",
                payload: data
            });
            yield put({
                type: "UPDATE_CUSTOMER_INFO_FROM_GET_APPOINTMENT",
                payload: {
                    customerId: data?.customerId || 0,
                    userId: data?.userId || 0,
                    firstName: data?.firstName || "",
                    lastName: data?.lastName || "",
                    phone: data?.phoneNumber || "",
                }
            });
            if (action.isGetBookingGroupId) {
                yield put({
                    type: "UPDATE_BOOKING_GROUP_ID",
                    payload: data?.bookingGroupId || 0
                })
            }

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
                message: responses?.message
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

function* addGiftCardIntoBlockAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'ADD_ITEM_INTO_APPOINTMENT',
                body: {
                    giftCards: [{
                        bookingGiftCardId: 0,
                        giftCardId: responses?.data?.giftCardId || 0
                    }],
                    services: [],
                    extras: [],
                    products: [],
                },
                method: 'PUT',
                token: true,
                api: `${apiConfigs.BASE_API}appointment/additem/${action.appointmentId}`,
                appointmentId: action.appointmentId,
                isBlock: true
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getCustomerBuyAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' })
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_CUSTOMER_INFO_BUY_APPOINTMENT_SUCCESS",
                payload: responses.data
            });

            yield put({
                type: "CHANGE_CUSTOMER_IN_APPOINTMENT",
            });

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: "GET_CUSTOMER_INFO_BUY_APPOINTMENT_FAIL",
                payload: action.customerInfoLocal
            });
            yield put({
                type: "CHANGE_CUSTOMER_IN_APPOINTMENT",
            });
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* changeCustomerInAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const state = yield select();
        const { groupAppointment, blockAppointments, customerInfoBuyAppointment } = state.appointment;

        const customerInfo = {
            customerId: customerInfoBuyAppointment?.customerId || 0,
            firstName: customerInfoBuyAppointment?.firstName || "",
            lastName: customerInfoBuyAppointment?.lastName || "",
            phoneNumber: customerInfoBuyAppointment?.phone || "",
        };

        // ---------------- Check group appointment --------------
        if (!_.isEmpty(groupAppointment)) {
            const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
            if (mainAppointmentId !== 0) {
                yield put({
                    type: 'UPDATE_CUSTOMER_IN_APPOINTMENT',
                    method: 'PUT',
                    body: customerInfo,
                    token: true,
                    api: `${apiConfigs.BASE_API}appointment/updateCustomer/${mainAppointmentId}`,
                    appointmentId: mainAppointmentId,
                    isGroup: true
                });
            }
        } else if (blockAppointments && blockAppointments.length > 0) {
            for (let i = 0; i < blockAppointments.length; i++) {
                yield put({
                    type: 'UPDATE_CUSTOMER_IN_APPOINTMENT',
                    method: 'PUT',
                    body: customerInfo,
                    token: true,
                    api: `${apiConfigs.BASE_API}appointment/updateCustomer/${blockAppointments[i].appointmentId}`,
                    isGroup: false,
                    appointmentId: blockAppointments[i].appointmentId
                });
            }
        }

    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updateCustomerInAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "UPDATE_CUSTOMER_ID_BUY_APPOINTMENT",
                payload: responses.data ? responses.data : 0
            });
            if (action.isGroup) {
                yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId}`,
                    token: true,
                    isNotUpdateCustomerBuyInRedux: true
                });
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
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* handleEnterGiftCardAmount(action) {
    try {
        yield put({
            type: "SWITCH_POPUP_GIFT_CARD_ENTER_AMOUNT",
            payload: false
        });
        delay(200);
        const state = yield select();
        const addGiftCardInfoAction = state?.appointment?.addGiftCardInfoAction || {};
        if (!addGiftCardInfoAction.bodyAction) {
            const groupAppointment = state?.appointment?.groupAppointment || {};
            const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
            yield put({
                type: 'ADD_ITEM_INTO_APPOINTMENT',
                body: {
                    giftCards: [{
                        giftCardId: addGiftCardInfoAction?.giftCardInfo?.giftCardId || 0,
                        price: action.payload
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
            });
        } else {
            const customerInfoBuyAppointment = state?.appointment?.customerInfoBuyAppointment;
            const isNotUpdateCustomerBuyInRedux = customerInfoBuyAppointment?.firstName || customerInfoBuyAppointment?.lastName || customerInfoBuyAppointment?.phone ? true : false;
            yield put({
                type: 'CREATE_ANYMOUS_APPOINTMENT',
                body: {
                    ...addGiftCardInfoAction.bodyAction,
                    giftCards: [{
                        giftCardId: addGiftCardInfoAction?.giftCardInfo?.giftCardId || 0,
                        price: action.payload
                    }]
                },
                ...addGiftCardInfoAction.optionAction,
                isNotUpdateCustomerBuyInRedux
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getGiftCardsActiveList(action) {
    try {
        if (action.isShowLoading) {
            yield put({ type: 'LOADING_ROOT' });
        }
        const responses = yield requestAPI(action);

        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_GIFT_CARDS_ACTIVE_LIST_SUCCESS",
                payload: responses?.data || [],
                currentPage: action?.currentPage,
                totalPages: responses?.pages || 1
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: "GET_GIFT_CARDS_ACTIVE_LIST_FAIL",
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({
            type: "GET_GIFT_CARDS_ACTIVE_LIST_FAIL",
        });
        yield put({ type: 'STOP_LOADING_ROOT' });

        yield put({ type: error });

    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getGiftCardLogs(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);

        // console.log("--getGiftCardLogs :"+ JSON.stringify(responses));

        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_GIFT_CARDS_LOGS_SUCCESS",
                payload: responses?.data || [],
                // currentPage: action?.currentPage,
                // totalPages: responses?.pages || 1
            })

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: "GET_GIFT_CARDS_LOGS_FAIL",
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({
            type: "GET_GIFT_CARDS_LOGS_FAIL",
        });
        yield put({ type: 'STOP_LOADING_ROOT' });

        yield put({ type: error });

    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

// ------------- New code ------------
function* checkCreditPaymentToServer(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log("-------- checkCreditPaymentToServer: ",JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
           yield put({
               type:"CHECK_CREDIT_PAYMENT_TO_SERVER_SUCCESS",
               payload: responses?.data || 0,
               paxAmount: action?.paxAmount || 0
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
            yield put({
                type:"CHECK_CREDIT_PAYMENT_TO_SERVER_FAIL",
            });
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
        yield put({
            type:"CHECK_CREDIT_PAYMENT_TO_SERVER_FAIL",
        });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

export default function* saga() {
    yield all([
        takeLatest('GET_APPOINTMENT_BY_ID', getAppointmentById),
        takeEvery('ADD_ITEM_INTO_APPOINTMENT', addItemIntoAppointment),
        takeLatest('REMOVE_ITEM_INTO_APPOINTMENT', removeItemIntoAppointment),
        takeLatest('CHECK_OUT_APPOINTMENT', checkoutAppointment),
        takeLatest('PAY_APPOINTMENT', paymentAppointment),
        takeLatest('CREATE_ANYMOUS_APPOINTMENT', createAnymousAppointment),
        takeLatest('CHECKOUT_SUBMIT', checkoutSubmit),
        takeLatest('SUBMIT_PAYMENT_WITH_CREDIT_CARD', submitPaymentWithCreditCard),
        takeLatest('CANCEL_HARMONY_PAYMENT', cancelHarmonyPayment),
        takeLatest('SUBMIT_APPOINTMENT_OFFLINE', submitAppointmentOffline),
        takeEvery('CANCEL_APPOINTMENT', cancleAppointment),
        takeEvery('GET_GROUP_APPOINTMENT_BY_ID', getGroupAppointmentById),
        takeLatest('REMOVE_APPOINTMENT_IN_GROUP', removeAppointmentInGroup),
        takeLatest('CHECK_SERIAL_NUMBER', checkSerialNumber),
        takeLatest('UPDATE_PRODUCT_IN_APPOINTMENT', updateProductInAppointment),
        takeLatest('CREATE_BLOCK_APPOINTMENT', createBlockAppointment),
        takeLatest('GET_BLOCK_APPOINTMENT_BY_ID', getBlockAppointmentById),
        takeLatest('ADD_GIFT_CARD_INTO_BLOCK_APPOINTMENT', addGiftCardIntoBlockAppointment),
        takeLatest('GET_CUSTOMER_INFO_BUY_APPOINTMENT', getCustomerBuyAppointment),
        takeLatest('CHANGE_CUSTOMER_IN_APPOINTMENT', changeCustomerInAppointment),
        takeEvery('UPDATE_CUSTOMER_IN_APPOINTMENT', updateCustomerInAppointment),
        takeLatest('HANDLE_ENTER_GIFT_CARD_AMOUNT', handleEnterGiftCardAmount),
        takeLatest('GET_GIFT_CARDS_ACTIVE_LIST', getGiftCardsActiveList),
        takeLatest('GET_GIFT_CARDS_LOGS', getGiftCardLogs),

        takeLatest('CHECK_CREDIT_PAYMENT_TO_SERVER', checkCreditPaymentToServer),
    ]);
}