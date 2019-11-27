import moment from 'moment';

import apiConfigs from '../../configs/api';

export function getAppointmentById(id) {
    return {
        type: 'GET_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/${id}`,
        // api: `${apiConfigs.BASE_API}getGroupById/${id}`,
        token: true
    }
}

export function addItemIntoAppointment(body, id) {
    return {
        type: 'ADD_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/additem/${id}`,
        appointmentId: id
    }
}


export function removeItemIntoAppointment(body, id) {
    return {
        type: 'REMOVE_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/removeitem/${id}`,
        appointmentId: id
    }
}

export function resetBasketEmpty() {
    return {
        type: 'RESET_BASKET_EMPTY'
    }
}

export function resetKeyUpdateAppointment() {
    return {
        type: 'RESET_KEY_GET_APPOINTMENT'
    }
}


export function checkoutAppointment(id) {
    return {
        type: 'CHECK_OUT_APPOINTMENT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/checkout/${id}`,
    }
}

export function paymentAppointment(appointmentId, method, isLoading = true) {
    return {
        type: 'PAY_APPOINTMENT',
        body: {
            method
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/pay/${appointmentId}`,
        paymentMethod: method,
        isLoading
    }
}

export function closeModalPaymentCompleted() {
    return {
        type: 'CLOSE_MODAL_PAYMENT_COMPLETED'
    }
}

export function createAnymousAppointment(merchantId, products, services = [], extras = [], paymentMethod, isLoading = true, customDiscountFixed, customDiscountPercent, staffId = 0,
    firstName, lastName, phoneNumber
) {
    return {
        type: 'CREATE_ANYMOUS_APPOINTMENT',
        body: {
            merchantId,
            userId: 0,
            status: 'checkin',
            services: services,
            extras: extras,
            products: products,
            fromTime: moment.parseZone(new Date()).local().format('MM/DD/YYYY h:mm A'),
            staffId,
            customDiscountFixed,
            customDiscountPercent,
            firstName,
            lastName,
            phoneNumber
        },
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}appointment`,
        paymentMethod,
        isLoading
    }
}

export function resetPayment() {
    return {
        type: 'RESET_PAYMENT'
    }
}

export function showModalPrintReceipt() {
    return {
        type: 'SHOW_MODAL_PRINT_RECEIPT'
    }
}


export function donePaymentHarmony() {
    return {
        type: 'PAY_APPOINTMENT_SUCCESS'
    }
}

export function checkoutSubmit(appointmentId) {
    return {
        type: 'CHECKOUT_SUBMIT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}checkout/submit/${appointmentId}`,
    }
}

export function referenceConnectionSignalR(connection) {
    return {
        type: 'REFERENCE_CONNECTION_SIGNALR',
        payload: connection
    }
}

export function resetConnectSignalR() {
    return {
        type: 'RESET_CONNECT_SIGNALR',
        payload: {}
    }
}

export function changeFlagSigninAppointment(flag = false) {
    return {
        type: 'CHANGE_FLAG_APPOINTMENT',
        payload: flag
    }
}


export function submitPaymentWithCreditCard(merchantId, userId, responseData, appointmentId) {
    return {
        type: 'SUBMIT_PAYMENT_WITH_CREDIT_CARD',
        body: {
            merchantId,
            userId,
            title: 'pax',
            responseData,
            appointmentId
        },
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}paymentTransaction`,
    }
}

export function cancelHarmonyPayment(appointmentId) {
    return {
        type: 'CANCEL_HARMONY_PAYMENT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/cancelmethod/${appointmentId}`,
    }
}

export function addAppointmentOfflineMode(body) {
    return {
        type: 'ADD_APPOINTMENT_OFFLINE_MODE',
        payload: body
    }
}

export function submitAppointmentOffline(body) {
    return {
        type: 'SUBMIT_APPOINTMENT_OFFLINE',
        body: body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}appointmentOffline`,
    }
}


export function cancleAppointment(appointmentId, merchantId, userId) {
    return {
        type: 'CANCEL_APPOINTMENT',
        body: {
            staffId: 0,
            customerId: 0,
            merchantId,
            userId,
            status: "cancel",
            services: [],
            products: [],
            extras: [],
            fromTime: new Date(),
            toTime: new Date(),
        }
        ,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/${appointmentId}`,
    }
}

