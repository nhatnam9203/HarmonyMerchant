import moment from 'moment';

import apiConfigs from '../../configs/api';

export function getAppointmentById(id) {
    return {
        type: 'GET_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/${id}`,
        token: true
    }
}

export function getGroupAppointmentById(id) {
    return {
        type: 'GET_GROUP_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/getGroupById/${id}`,
        token: true
    }
}

export function addItemIntoAppointment(body, id, isGroup = false) {
    return {
        type: 'ADD_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/additem/${id}`,
        appointmentId: id,
        isGroup
    }
}


export function removeItemIntoAppointment(body, appointmentId, isGroup = false) {
    return {
        type: 'REMOVE_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/removeitem/${appointmentId}`,
        appointmentId,
        isGroup
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


export function checkoutAppointment(appointmentId, checkoutGroupId = 0) {
    return {
        type: 'CHECK_OUT_APPOINTMENT',
        body: {
            checkoutGroupId,
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/checkout/${appointmentId}`,
        checkoutGroupId,
        appointmentId
    }
}

export function paymentAppointment(groupId, method, amount, creditCardInfo = false, merchantId = -1) {
    return {
        type: 'PAY_APPOINTMENT',
        body: {
            method,
            amount
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/selectpaymentmethod/${groupId}`,
        paymentMethod: method,
        amount,
        creditCardInfo,
        merchantId
    }
}

export function closeModalPaymentCompleted() {
    return {
        type: 'CLOSE_MODAL_PAYMENT_COMPLETED'
    }
}

export function createAnymousAppointment(merchantId, userId = 0, products, services = [], extras = [], paymentMethod, isLoading = true, customDiscountFixed, customDiscountPercent, staffId = 0,
    firstName, lastName, phoneNumber, paidAmount, creditCardInfo = false, isPayment = true
) {
    return {
        type: 'CREATE_ANYMOUS_APPOINTMENT',
        body: {
            merchantId,
            userId: userId,
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
        isLoading,
        paidAmount,
        creditCardInfo,
        merchantId,
        isPayment
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

export function removeAppointmentInGroup(appointmentId) {
    return {
        type: 'REMOVE_APPOINTMENT_IN_GROUP',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/removeGroup/${appointmentId}`,
    }
}

export function resetGroupAppointment() {
    return {
        type: 'RESET_GROUP_APPOINTMENT',
    }
}

export function closePopupPaymentDetail() {
    return {
        type: 'CLOSE_POPUP_PAYMENT_DETAIL',
    }
}

export function completeTransaction() {
    return {
        type: 'TRACSACTION_COMPLETED',
    }
}


export function updatePaymentInfoByHarmonyPayment(data) {
    return {
        type: 'UPDATE_PAYMENT_DETAIL_INFO_BY_HARMONY_PAYMENT',
        payload: data
    }
}

export function showPopupChangeMoney(data) {
    return {
        type: 'SHOW_POPUP_CHANGED_MONEY',
        payload: data
    }
}

export function showPopupPaymentDetails() {
    return {
        type: 'SHOW_POPUP_PAYMENT_DETAILS',
    }
}

export function handleVisibleActiveGiftCard(visible = true) {
    return {
        type: 'VISIBLE_POPUP_ACTIVEE_GIFT_CARD',
        payload: visible
    }
}

export function checkSerialNumber(serialId, bodyAction = false, optionAction = false) {
    return {
        type: 'CHECK_SERIAL_NUMBER',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}giftcard/serialNumber/${serialId}`,
        bodyAction,
        optionAction

    }
}

export function updateCustomerInAppointment(appointmentID, body) {
    return {
        type: 'UPDATE_CUSTOMER_IN_APPOINTMENT',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}appointment/updateCustomer/${appointmentID}`,

    }
}


export function setWebviewRefToRedux(webviewRef) {
    return {
        type: 'SET_WEBVIEW_REF_TO_REDUX',
        payload: webviewRef
    }
}